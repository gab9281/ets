import { marked, Renderer } from 'marked';

const renderer = new Renderer();

renderer.image = ({href, title, text}) => {
    const [width, height] = title?.startsWith('=') ? title.slice(1).split('x').map(v => v.trim()).filter(Boolean) : [];
    return `<img src="${href}" alt="${text}"${width ? ` width="${width}"` : ''}${height ? ` height="${height}"` : ''}>`;
}

marked.use({
  renderer: renderer
});

export default marked;
