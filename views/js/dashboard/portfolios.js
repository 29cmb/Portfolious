function createPortfolio(name, description) {
    const portfolio = document.createElement('div');
    portfolio.className = 'portfolio animate__animated animate__fadeInUp';

    const title = document.createElement('h2');
    title.textContent = name;
    portfolio.appendChild(title);

    portfolio.appendChild(document.createElement('br'));

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('fill', '#fff');
    svg.setAttribute('xmlns:x', 'http://ns.adobe.com/Extensibility/1.0/');
    svg.setAttribute('xmlns:i', 'http://ns.adobe.com/AdobeIllustrator/10.0/');
    svg.setAttribute('xmlns:graph', 'http://ns.adobe.com/Graphs/1.0/');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    svg.setAttribute('version', '1.1');
    svg.setAttribute('x', '0px');
    svg.setAttribute('y', '0px');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('style', 'enable-background:new 0 0 100 100;');
    svg.setAttribute('xml:space', 'preserve');

    const switchElement = document.createElementNS('http://www.w3.org/2000/svg', 'switch');
    const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    foreignObject.setAttribute('requiredExtensions', 'http://ns.adobe.com/AdobeIllustrator/10.0/');
    foreignObject.setAttribute('x', '0');
    foreignObject.setAttribute('y', '0');
    foreignObject.setAttribute('width', '1');
    foreignObject.setAttribute('height', '1');
    switchElement.appendChild(foreignObject);

    const g1 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g1.setAttribute('i:extraneous', 'self');

    const g2 = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M86.5,28.6h-8.1l-1-7.1c-0.4-2.9-1.9-5.5-4.2-7.3c-2.3-1.8-5.2-2.5-8.1-2.1L12,19.5c-6,0.8-10.2,6.4-9.4,12.4l5,37     c0.8,5.5,5.5,9.5,10.9,9.5c0.5,0,1,0,1.5-0.1l2.1-0.3c0.5,5.6,5.2,10,10.9,10h53.6c6,0,11-4.9,11-11V39.6     C97.5,33.6,92.6,28.6,86.5,28.6z M91.5,39.6V71L75.7,52.9c-2.6-3-7.4-3-10,0L52.1,68.5l-4.9-5.4c-2.5-2.7-6.8-2.7-9.2,0L28,74     V39.6c0-2.7,2.2-5,5-5h53.6C89.3,34.6,91.5,36.9,91.5,39.6z M22,39.6v32.2l-2.8,0.4c-2.7,0.4-5.2-1.5-5.6-4.3L8.5,31     c-0.4-2.7,1.5-5.2,4.3-5.6l53.1-7.3c0.2,0,0.5,0,0.7,0c2.4,0,4.6,1.8,4.9,4.3l0.9,6.3H33C26.9,28.6,22,33.6,22,39.6z');
    g2.appendChild(path);

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '42.5');
    circle.setAttribute('cy', '47.8');
    circle.setAttribute('r', '6');
    g2.appendChild(circle);

    g1.appendChild(g2);
    switchElement.appendChild(g1);
    svg.appendChild(switchElement);

    portfolio.appendChild(svg);

    const desc = document.createElement('p');
    desc.textContent = description;
    portfolio.appendChild(desc);

    const button = document.createElement('button');
    button.className = 'portfolio-btn';
    button.textContent = 'Open';
    portfolio.appendChild(button);

    return portfolio;
}

const portfolio1 = createPortfolio("Portfolio Name", "This is the portfolio description. You can use a maximum of 250 characters")
const portfolio2 = createPortfolio("Portfolio Name", "This is the portfolio description. You can use a maximum of 250 characters")
const portfolio3 = createPortfolio("Portfolio Name", "This is the portfolio description. You can use a maximum of 250 characters")
document.getElementById("portfolios").appendChild(portfolio1)
document.getElementById("portfolios").appendChild(portfolio2)
document.getElementById("portfolios").appendChild(portfolio3)