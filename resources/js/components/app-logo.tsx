import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className='flex gap-1 items-center'>
            <div className="flex aspect-square size-8">
                <AppLogoIcon />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    GATHERLY DEGVORA
                </span>
            </div>
        </div>
    );
}
