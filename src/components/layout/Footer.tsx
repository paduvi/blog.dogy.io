import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t mt-12 py-8">
            <div className="container">
                <div className="flex flex-col md-flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white font-bold text-sm">
                            D
                        </div>
                        <span className="font-bold text-lg">Dogy.io</span>
                        <span className="text-muted text-sm ml-2">© 2023</span>
                    </div>

                    <div className="flex gap-6 text-sm text-muted">
                        {/* <Link href="/about" className="hover-text-main">About</Link>
                        <Link href="/privacy" className="hover-text-main">Privacy</Link>
                        <Link href="/terms" className="hover-text-main">Terms</Link>
                        <Link href="/contact" className="hover-text-main">Contact</Link> */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
