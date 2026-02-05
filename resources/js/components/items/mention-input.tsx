import { useRef, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface MentionInputProps {
    value: string;
    onChange: (value: string) => void;
    onMentionedUsersChange: (userIds: number[]) => void;
    spaceSlug: string;
    placeholder?: string;
    rows?: number;
    id?: string;
}

export default function MentionInput({
    value,
    onChange,
    onMentionedUsersChange,
    spaceSlug,
    placeholder,
    rows = 3,
    id,
}: MentionInputProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mentionQuery, setMentionQuery] = useState('');
    const [dropdownPosition, setDropdownPosition] = useState({
        top: 0,
        left: 0,
    });
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastEmittedValue = useRef<string>(value);
    const [initialized, setInitialized] = useState(false);

    // --- Parsing Logic ---

    // Convert Backend Format -> HTML
    const toHtml = useCallback((text: string) => {
        if (!text) return '';

        let html = text.replace(
            /\{user_id:(\d+),name:([^}]+)\}/g,
            (match, id, name) => {
                return `<span class="inline-flex items-center rounded-sm bg-blue-100 px-1 py-0.5 text-sm font-medium text-blue-800 select-none m-0.5 align-middle" contenteditable="false" data-user-id="${id}" data-user-name="${name}">@${name}</span>`;
            },
        );

        return html;
    }, []);

    // Convert HTML -> Backend Format & Extract IDs
    const parseContent = () => {
        if (!editorRef.current) return { text: '', ids: [] as number[] };

        const clone = editorRef.current.cloneNode(true) as HTMLElement;
        const spans = clone.querySelectorAll('span[data-user-id]');
        const ids: number[] = [];

        spans.forEach((span: Element) => {
            const id = span.getAttribute('data-user-id');
            const name = span.getAttribute('data-user-name');
            if (id && name) {
                ids.push(parseInt(id));
                const replacement = document.createTextNode(
                    `{user_id:${id},name:${name}}`,
                );
                span.parentNode?.replaceChild(replacement, span);
            }
        });

        // Use innerText to get new lines correctly, but normalize spaces
        let text = clone.innerText.replace(/\u00A0/g, ' ');

        return { text, ids };
    };

    // --- Effects ---

    // Sync value from prop to DOM (only if changed externally)
    useEffect(() => {
        if (value !== lastEmittedValue.current && editorRef.current) {
            // Check if semantically different to avoid cursor jumps
            const newHtml = toHtml(value);
            if (editorRef.current.innerHTML !== newHtml) {
                editorRef.current.innerHTML = newHtml;
            }
        }
        lastEmittedValue.current = value;
        if (!initialized) setInitialized(true);
    }, [value, toHtml, initialized]);

    // Search Users
    useEffect(() => {
        if (!mentionQuery) {
            setSearchResults([]);
            return;
        }

        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const response = await axios.get(
                    `/spaces/${spaceSlug}/members/search`,
                    {
                        params: { q: mentionQuery },
                        headers: { Accept: 'application/json' },
                    },
                );
                setSearchResults(response.data);
                setSelectedIndex(0);
            } catch (error) {
                console.error('Search failed', error);
                setSearchResults([]);
            }
        }, 300);

        return () => {
            if (searchTimeoutRef.current)
                clearTimeout(searchTimeoutRef.current);
        };
    }, [mentionQuery, spaceSlug]);

    // --- Event Handlers ---

    const handleInput = () => {
        const { text, ids } = parseContent();
        lastEmittedValue.current = text;
        onChange(text);
        onMentionedUsersChange(ids);
        checkMentionTrigger();
    };

    const checkMentionTrigger = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;

        // Only trigger if we are in a text node
        if (textNode.nodeType !== Node.TEXT_NODE) return;

        const textBeforeCursor =
            textNode.textContent?.substring(0, range.startOffset) || '';
        const atIndex = textBeforeCursor.lastIndexOf('@');

        if (atIndex !== -1) {
            const query = textBeforeCursor.substring(atIndex + 1);
            // Allow searching if no spaces (simple names)
            if (!/\s/.test(query)) {
                setMentionQuery(query);

                // Position Dropdown
                const rect = range.getBoundingClientRect();
                const editorRect = editorRef.current?.getBoundingClientRect();

                if (rect && editorRect) {
                    setDropdownPosition({
                        top: rect.bottom - editorRect.top + 24, // Relative top + offset
                        left: rect.left - editorRect.left,
                    });
                }
                setShowDropdown(true);
                return;
            }
        }
        setShowDropdown(false);
        setMentionQuery('');
    };

    const insertMention = (user: User) => {
        const selection = window.getSelection();
        if (!selection || !editorRef.current) return;

        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;

        if (textNode.nodeType === Node.TEXT_NODE) {
            const textContent = textNode.textContent || '';
            const atIndex = textContent.lastIndexOf('@', range.startOffset - 1);

            if (atIndex !== -1) {
                // Determine length of query to remove
                const queryLength = range.startOffset - atIndex;

                range.setStart(textNode, atIndex);
                range.setEnd(textNode, atIndex + queryLength);
                range.deleteContents();

                // Create Badge Element
                const userName =
                    typeof user === 'object' && 'first_name' in user
                        ? `${(user as any).first_name} ${(user as any).last_name}`.trim()
                        : (user as any).name || '';

                const badge = document.createElement('span');
                badge.className =
                    'inline-flex items-center rounded-sm bg-blue-100 px-1 py-0.5 text-sm font-medium text-blue-800 select-none m-0.5 align-middle';
                badge.contentEditable = 'false';
                badge.innerText = `@${userName}`;
                badge.setAttribute('data-user-id', user.id.toString());
                badge.setAttribute('data-user-name', userName);

                // Insert Badge
                range.insertNode(badge);

                // Add space after
                const space = document.createTextNode('\u00A0');
                range.setStartAfter(badge);
                range.setEndAfter(badge);
                range.insertNode(space);

                // Move Cursor After Space
                range.setStartAfter(space);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);

                // Update State
                setShowDropdown(false);
                setMentionQuery('');

                // Trigger input event manually to sync state
                handleInput();

                // Refocus editor
                editorRef.current.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (showDropdown && searchResults.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((i) => (i + 1) % searchResults.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(
                    (i) =>
                        (i - 1 + searchResults.length) % searchResults.length,
                );
            } else if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                insertMention(searchResults[selectedIndex]);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setShowDropdown(false);
            }
        }
    };

    return (
        <div className="relative">
            <div
                ref={editorRef}
                id={id}
                role="textbox"
                tabIndex={0}
                contentEditable
                className={cn(
                    'min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
                    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                    'overflow-y-auto wrap-break-word whitespace-pre-wrap disabled:cursor-not-allowed disabled:opacity-50',
                )}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onBlur={handleInput}
                style={{ maxHeight: rows ? `${rows * 2}rem` : 'auto' }}
            />

            {/* Placeholder Overlay */}
            {!value && (
                <div className="pointer-events-none absolute top-2 left-3 text-sm text-muted-foreground">
                    {placeholder}
                </div>
            )}

            {/* Dropdown */}
            {showDropdown && searchResults.length > 0 && (
                <div
                    className="absolute z-50 w-64 animate-in overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md fade-in-0 zoom-in-95"
                    style={{
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                    }}
                >
                    <div className="max-h-64 overflow-auto p-1">
                        {searchResults.map((user, index) => {
                            const userName =
                                typeof user === 'object' && 'first_name' in user
                                    ? `${(user as any).first_name} ${(user as any).last_name}`.trim()
                                    : (user as any).name || '';
                            const userAvatar = (user as any).avatar || null;

                            return (
                                <div
                                    key={user.id}
                                    className={cn(
                                        'flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none',
                                        index === selectedIndex
                                            ? 'bg-accent text-accent-foreground'
                                            : '',
                                    )}
                                    onClick={() => insertMention(user)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    <Avatar className="mr-2 h-6 w-6">
                                        <AvatarImage
                                            src={userAvatar}
                                            alt={userName}
                                        />
                                        <AvatarFallback>
                                            {userName.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>{userName}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
