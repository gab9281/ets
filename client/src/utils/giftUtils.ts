export function escapeForGIFT(link: string): string {
    const specialChars = /[{}#~=<>\:]/g;
    return link.replace(specialChars, (match) => `\\${match}`);
}
