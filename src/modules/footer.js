import css from './footer.css';

const footer = document.createElement('footer');
const p = document.createElement('p');
p.classList.add('footer-text-content');
p.innerHTML = `Copyright ©
            <script>
                document.write(new Date().getFullYear())
            </script>
            <a href="https://github.com/isiNavarro" target="_blank">
                isiNavarro
            </a>`;

footer.appendChild(p);

export default footer;
