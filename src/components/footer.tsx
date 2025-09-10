'use client';

export function Footer() {
    return (
        <footer className="py-4 px-4 md:px-6 border-t bg-background text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} MICROTECH 365 LLC. All rights reserved.</p>
        </footer>
    );
}
