import Link from 'next/link';

export default function BuyMeACoffee() {
    return (
        <section className="bg-white rounded-xl p-6 border h-fit">
            <h3 className="font-bold text-lg mb-4">Support Me</h3>
            <p className="text-gray-600 mb-6 text-sm">
                If you find my content helpful, you can support me by buying me a coffee!
            </p>
            <Link
                href="https://www.buymeacoffee.com/paduvi"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-bmc w-full shadow-sm"
            >
                <span className="mr-2 text-xl">☕</span>
                Buy me a coffee
            </Link>
        </section>
    );
}
