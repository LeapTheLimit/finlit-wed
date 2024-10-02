import PoweredBy from '../components/PoweredBy';
import Logo from './Logo';

function LogoPoweredBy() {
    return (
        <div className="w-full flex justify-between items-center mb-12 flex-col gap-2">
            <Logo />
            <PoweredBy />
        </div>
    )
}

export default LogoPoweredBy