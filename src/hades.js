(async () => {
    'use strict';
    const S_KEY = 'grok-hades-terminal-cache-v1';

    let stateCache = null;
    try { stateCache = JSON.parse(localStorage.getItem(S_KEY)); } catch (e) { }

    if (window.__hds) {
        if (window.__hds.spawn) {
            window.__hds.spawn();
            return;
        }
        window.__hds.teardowns.forEach(f => f(true));
    }

    window.__hds = { terminals: [], teardowns: [] };
    let globalState = stateCache || { openIds: [], configs: {} };
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;


    const hds_el = (tag, attrs, children) => {
        const e = document.createElement(tag);
        if (attrs) {
            for (let k in attrs) {
                if (k === 'style') e.style.cssText = attrs[k];
                else if (k === 'className') e.className = attrs[k];
                else if (k.startsWith('on') && typeof attrs[k] === 'function') e.addEventListener(k.substring(2).toLowerCase(), attrs[k]);
                else e.setAttribute(k, attrs[k]);
            }
        }
        if (children) {
            for (let c of (Array.isArray(children) ? children : [children])) {
                if (typeof c === 'string') e.appendChild(document.createTextNode(c));
                else if (c) e.appendChild(c);
            }
        }
        return e;
    };
    const hds_svg = (paths) => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "14"); svg.setAttribute("height", "14"); svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round"); svg.setAttribute("stroke-linejoin", "round");
        paths.forEach(p => {
            const path = document.createElementNS("http://www.w3.org/2000/svg", p.tag);
            for (let k in p.attrs) path.setAttribute(k, p.attrs[k]);
            svg.appendChild(path);
        });
        return svg;
    };
    const getIconCopy = () => hds_svg([{ tag: 'rect', attrs: { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" } }, { tag: 'path', attrs: { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" } }]);
    const getIconCheck = () => hds_svg([{ tag: 'polyline', attrs: { points: "20 6 9 17 4 12" } }]);
    const getIconTheme = () => hds_svg([{ tag: 'circle', attrs: { cx: "12", cy: "12", r: "10" } }, { tag: 'line', attrs: { x1: "14.31", y1: "8", x2: "20.05", y2: "17.94" } }, { tag: 'line', attrs: { x1: "9.69", y1: "8", x2: "21.17", y2: "8" } }, { tag: 'line', attrs: { x1: "7.38", y1: "12", x2: "13.12", y2: "2.06" } }, { tag: 'line', attrs: { x1: "9.69", y1: "16", x2: "3.95", y2: "6.06" } }, { tag: 'line', attrs: { x1: "14.31", y1: "16", x2: "2.83", y2: "16" } }, { tag: 'line', attrs: { x1: "16.62", y1: "12", x2: "10.88", y2: "21.94" } }]);
    const getIconTrash = () => hds_svg([{ tag: 'polyline', attrs: { points: "3 6 5 6 21 6" } }, { tag: 'path', attrs: { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" } }, { tag: 'line', attrs: { x1: "10", y1: "11", x2: "10", y2: "17" } }, { tag: 'line', attrs: { x1: "14", y1: "11", x2: "14", y2: "17" } }]);
    const getIconFont = () => hds_svg([{ tag: 'polyline', attrs: { points: "4 7 4 4 20 4 20 7" } }, { tag: 'line', attrs: { x1: "9", y1: "20", x2: "15", y2: "20" } }, { tag: 'line', attrs: { x1: "12", y1: "4", x2: "12", y2: "20" } }]);
    const getIconSync = () => hds_svg([{ tag: 'polyline', attrs: { points: "23 4 23 10 17 10" } }, { tag: 'polyline', attrs: { points: "1 20 1 14 7 14" } }, { tag: 'path', attrs: { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" } }]);
    const getIconEye = () => hds_svg([{ tag: 'path', attrs: { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" } }, { tag: 'circle', attrs: { cx: "12", cy: "12", r: "3" } }]);
    const getIconDrop = () => hds_svg([{ tag: 'path', attrs: { d: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" } }]);
    const getIconShell = () => hds_svg([{ tag: 'polyline', attrs: { points: "4 17 10 11 4 5" } }, { tag: 'line', attrs: { x1: "12", y1: "19", x2: "20", y2: "19" } }]);
    const getIconDl = () => hds_svg([{ tag: 'path', attrs: { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" } }, { tag: 'polyline', attrs: { points: "7 10 12 15 17 10" } }, { tag: 'line', attrs: { x1: "12", y1: "15", x2: "12", y2: "3" } }]);
    const getIconArrowRight = () => hds_svg([{ tag: 'line', attrs: { x1: "5", y1: "12", x2: "19", y2: "12" } }, { tag: 'polyline', attrs: { points: "12 5 19 12 12 19" } }]);
    const getIconClock = () => hds_svg([{ tag: 'circle', attrs: { cx: "12", cy: "12", r: "10" } }, { tag: 'polyline', attrs: { points: "12 6 12 12 16 14" } }]);
    const getIconClose = () => hds_svg([{ tag: 'line', attrs: { x1: "18", y1: "6", x2: "6", y2: "18" } }, { tag: 'line', attrs: { x1: "6", y1: "6", x2: "18", y2: "18" } }]);
    const getIconPlus = () => hds_svg([{ tag: 'line', attrs: { x1: "12", y1: "5", x2: "12", y2: "19" } }, { tag: 'line', attrs: { x1: "5", y1: "12", x2: "19", y2: "12" } }]);

    const THEMES = [
        { name: 'Dark', bg: '13, 17, 23', fg: '#c9d1d9', p: '#3fb950', c: '#58a6ff', e: '#ff7b72', b: 'rgba(255,255,255,0.15)', shd: '0,0,0' },
        { name: 'Light', bg: '250, 250, 250', fg: '#24292f', p: '#1a7f37', c: '#0969da', e: '#cf222e', b: 'rgba(0,0,0,0.2)', shd: '255,255,255' },
        { name: 'Matrix', bg: '0, 10, 0', fg: '#00ff00', p: '#00ff00', c: '#00cc00', e: '#ff0000', b: 'rgba(0,255,0,0.4)', shd: '0,0,0' },
        { name: 'Dracula', bg: '40, 42, 54', fg: '#f8f8f2', p: '#50fa7b', c: '#8be9fd', e: '#ff5555', b: 'rgba(255,255,255,0.1)', shd: '0,0,0' },
        { name: 'Monokai', bg: '39, 40, 34', fg: '#f8f8f2', p: '#a6e22e', c: '#66d9ef', e: '#f92672', b: 'rgba(255,255,255,0.1)', shd: '0,0,0' },
        { name: 'Nord', bg: '46, 52, 64', fg: '#d8dee9', p: '#a3be8c', c: '#81a1c1', e: '#bf616a', b: 'rgba(255,255,255,0.1)', shd: '0,0,0' },
        { name: 'Gruvbox', bg: '40, 40, 40', fg: '#ebdbb2', p: '#b8bb26', c: '#83a598', e: '#fb4934', b: 'rgba(255,255,255,0.1)', shd: '0,0,0' },
        { name: 'Tokyo Night', bg: '26, 27, 38', fg: '#a9b1d6', p: '#9ece6a', c: '#7aa2f7', e: '#f7768e', b: 'rgba(255,255,255,0.1)', shd: '0,0,0' },
        { name: 'Cyberpunk', bg: '15, 15, 15', fg: '#ff0055', p: '#00ffff', c: '#ffff00', e: '#ff3131', b: 'rgba(0,255,255,0.3)', shd: '0,0,0' },
        { name: 'Synthwave', bg: '43, 33, 58', fg: '#f9c5d1', p: '#f97e72', c: '#6bf0fa', e: '#ff5370', b: 'rgba(255,255,255,0.15)', shd: '0,0,0' },
        { name: 'Solarized', bg: '0, 43, 54', fg: '#839496', p: '#859900', c: '#2aa198', e: '#dc322f', b: 'rgba(0,255,255,0.1)', shd: '0,0,0' },
        { name: 'Ubuntu', bg: '48, 10, 36', fg: '#eeeeee', p: '#4e9a06', c: '#3465a4', e: '#cc0000', b: 'rgba(255,255,255,0.15)', shd: '0,0,0' },
        { name: 'Oceanic', bg: '27, 43, 52', fg: '#d8dee9', p: '#99c794', c: '#6699cc', e: '#ec5f67', b: 'rgba(255,255,255,0.1)', shd: '0,0,0' },
        { name: 'CRT', bg: '0, 0, 0', fg: '#33ff00', p: '#33ff00', c: '#33ff00', e: '#ff0000', b: 'rgba(51,255,0,0.5)', shd: '0,0,0' },
        { name: 'One Dark', bg: '40, 44, 52', fg: '#abb2bf', p: '#98c379', c: '#61afef', e: '#e06c75', b: 'rgba(255,255,255,0.1)', shd: '0,0,0' },
        { name: 'Catppuccin Mocha', bg: '30, 30, 46', fg: '#cdd6f4', p: '#a6e3a1', c: '#89b4fa', e: '#f38ba8', b: 'rgba(255,255,255,0.1)', shd: '0,0,0' },
        { name: 'Rose Pine', bg: '25, 23, 36', fg: '#e0def4', p: '#9ccfd8', c: '#c4a7e7', e: '#eb6f92', b: 'rgba(224,222,244,0.15)', shd: '0,0,0' },
        { name: 'Amber', bg: '28, 20, 0', fg: '#ffb000', p: '#ffb000', c: '#ffcc33', e: '#ff4f1f', b: 'rgba(255,176,0,0.4)', shd: '0,0,0' },
        { name: 'Catppuccin Latte', bg: '239, 241, 245', fg: '#4c4f69', p: '#40a02b', c: '#1e66f5', e: '#d20f39', b: 'rgba(0,0,0,0.15)', shd: '255,255,255' },
        { name: 'Solarized Light', bg: '253, 246, 227', fg: '#657b83', p: '#859900', c: '#2aa198', e: '#dc322f', b: 'rgba(0,0,0,0.15)', shd: '255,255,255' },
        { name: 'Sakura', bg: '255, 240, 245', fg: '#7a4f63', p: '#e75a9c', c: '#9b5de5', e: '#e63950', b: 'rgba(199,79,156,0.25)', shd: '255,255,255' }
    ];

    const isGrok = window.location.hostname.includes('grok.com');
    if (!isGrok && !window.__hds_confirmed) {
        if (document.getElementById('hds-domain-warning')) return;
        const proceed = await new Promise(resolve => {
            const t = THEMES[(globalState.configs[0] && globalState.configs[0].themeIdx) || 0] || THEMES[0];
            const box = document.createElement('div');
            box.id = 'hds-domain-warning';
            box.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(${t.bg},0.95);color:${t.fg};padding:25px;border:1px solid ${t.b};border-radius:12px;z-index:2147483647;box-shadow:0 16px 48px rgba(${t.shd},0.5);font-family:ui-monospace,SFMono-Regular,monospace;text-align:center;backdrop-filter:blur(8px);min-width:300px;`;

            box.appendChild(hds_el('div', { style: `margin-bottom:15px;font-size:18px;font-weight:bold;color:${t.e}` }, "⚠️ Domain Warning"));
            const msg = hds_el('div', { style: "margin-bottom:25px;font-size:14px;opacity:0.85;line-height:1.5;" }, "Hades Terminal is designed to run on grok.com.");
            msg.appendChild(document.createElement('br'));
            msg.appendChild(document.createTextNode("Running it here may result in blocked requests or errors."));
            msg.appendChild(document.createElement('br'));
            msg.appendChild(document.createElement('br'));
            msg.appendChild(document.createTextNode("Proceed anyway?"));
            box.appendChild(msg);

            const btnNo = hds_el('button', { className: 'hds-btn-no', style: `flex:1;padding:10px;background:transparent;border:1px solid ${t.b};color:${t.fg};border-radius:6px;cursor:pointer;font-weight:bold;transition:background 0.2s;`, onmouseover: () => btnNo.style.background = t.b, onmouseout: () => btnNo.style.background = 'transparent' }, "No");
            const btnYes = hds_el('button', { className: 'hds-btn-yes', style: `flex:1;padding:10px;background:${t.p};border:none;color:#fff;border-radius:6px;cursor:pointer;font-weight:bold;transition:filter 0.2s;`, onmouseover: () => btnYes.style.filter = 'brightness(1.2)', onmouseout: () => btnYes.style.filter = 'none' }, "Yes");
            box.appendChild(hds_el('div', { style: "display:flex;gap:12px;justify-content:center;" }, [btnNo, btnYes]));
            document.body.appendChild(box);
            box.querySelector('.hds-btn-no').onclick = () => { box.remove(); resolve(false); };
            box.querySelector('.hds-btn-yes').onclick = () => { box.remove(); resolve(true); };
        });
        if (!proceed) return;
        window.__hds_confirmed = true;
    }

    const FONTS = [
        { name: 'System Mono', v: 'ui-monospace, SFMono-Regular, Consolas, Menlo, monospace' },
        { name: 'Fira Code', v: '"Fira Code", monospace' },
        { name: 'JetBrains', v: '"JetBrains Mono", monospace' },
        { name: 'Cascadia', v: '"Cascadia Code", monospace' },
        { name: 'Anonymous Pro', v: '"Anonymous Pro", monospace' },
        { name: 'Inconsolata', v: 'Inconsolata, monospace' },
        { name: 'Source Code Pro', v: '"Source Code Pro", monospace' },
        { name: 'Courier New', v: '"Courier New", Courier, monospace' },
        { name: 'Comic Sans', v: '"Comic Sans MS", "Comic Sans", cursive' },
        { name: 'Hack', v: 'Hack, monospace' },
        { name: 'IBM Plex Mono', v: '"IBM Plex Mono", monospace' },
        { name: 'Roboto Mono', v: '"Roboto Mono", monospace' },
        { name: 'Ubuntu Mono', v: '"Ubuntu Mono", monospace' }
    ];

    const SHELLS = ['bash', 'python', 'custom'];
    const DL_ALIASES = ['dl', 'get', 'pull'];

    // Load the non-system fonts once at the document level (not inside the shadow
    // root) so the families reliably resolve for every terminal's shadow DOM.
    const FONT_HREFS = [
        'https://fonts.googleapis.com/css2?family=Anonymous+Pro&family=Fira+Code&family=IBM+Plex+Mono&family=Inconsolata&family=JetBrains+Mono&family=Roboto+Mono&family=Source+Code+Pro&family=Ubuntu+Mono&display=swap',
        'https://cdn.jsdelivr.net/npm/@fontsource/cascadia-code/index.css',
        'https://cdn.jsdelivr.net/npm/@fontsource/hack/index.css'
    ];
    FONT_HREFS.forEach((href, i) => {
        const id = `hds-font-${i}`;
        if (document.getElementById(id)) return;
        const link = document.createElement('link');
        link.id = id; link.rel = 'stylesheet'; link.href = href;
        (document.head || document.documentElement).appendChild(link);
    });


    const saveState = () => {
        globalState.openIds = window.__hds.terminals.map(t => t.id);
        window.__hds.terminals.forEach(t => {
            globalState.configs[t.id] = { ...t.state };
        });
        try { localStorage.setItem(S_KEY, JSON.stringify(globalState)); } catch (e) { }
    };

    let launcher = document.getElementById('hds-launcher-host');
    if (launcher) launcher.remove();
    launcher = document.createElement('div');
    launcher.id = 'hds-launcher-host';
    Object.assign(launcher.style, {
        position: 'fixed', bottom: '20px', right: '20px', zIndex: '2147483646',
        width: '40px', height: '40px', background: 'rgba(13, 17, 23, 0.9)',
        border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%',
        display: 'none', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        color: '#c9d1d9', transition: 'transform 0.2s'
    });

    const launcherIcon = hds_svg([{ tag: 'polyline', attrs: { points: "4 17 10 11 4 5" } }, { tag: 'line', attrs: { x1: "12", y1: "19", x2: "20", y2: "19" } }]);
    launcherIcon.style.cssText = "width:20px;height:20px;";
    launcher.appendChild(launcherIcon);
    const launcherClose = hds_el('div', { className: 'l-close', title: 'Close Launcher', style: 'position:absolute;top:-4px;right:-4px;background:#ff5f56;color:#fff;border-radius:50%;width:14px;height:14px;font-size:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity 0.2s;' }, '×');
    launcher.appendChild(launcherClose);
    document.body.appendChild(launcher);

    launcher.addEventListener('mouseenter', () => { launcher.style.transform = 'scale(1.1)'; launcherClose.style.opacity = '1'; });
    launcher.addEventListener('mouseleave', () => { launcher.style.transform = 'scale(1)'; launcherClose.style.opacity = '0'; });
    launcher.addEventListener('click', () => {
        if (window.__hds.terminals.length === 0) {
            globalState.openIds = [0];
            new Terminal(0, globalState.configs[0] || {});
        } else {
            window.__hds.terminals.forEach(t => t.toggleVisibility(true));
        }
        updateLauncher();
    });
    launcher.querySelector('.l-close').addEventListener('click', (e) => {
        e.stopPropagation(); launcher.style.display = 'none';
        if (!globalState.hideF4Toast) showF4Toast();
    });

    const showF4Toast = () => {
        if (document.getElementById('hds-f4-toast')) return;
        const t = THEMES[(globalState.configs[0] && globalState.configs[0].themeIdx) || 0] || THEMES[0];
        const toast = document.createElement('div');
        toast.id = 'hds-f4-toast';
        toast.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);background:rgba(${t.bg},0.95);color:${t.fg};padding:12px 18px;border:1px solid ${t.b};border-radius:8px;z-index:2147483647;box-shadow:0 8px 24px rgba(${t.shd},0.5);font-family:ui-monospace,SFMono-Regular,monospace;display:flex;align-items:center;gap:12px;backdrop-filter:blur(8px);opacity:0;transition:opacity 0.8s ease-out;`;

        const toastMsg = hds_el('div', { style: "font-size:13px;" }, ["Press ", hds_el('strong', { style: `color:${t.p}` }, "F4"), " to reopen."]);
        const dontShowBtn = hds_el('button', { className: 'hds-btn-dont-show', style: `background:transparent;border:1px solid ${t.b};color:${t.fg};border-radius:4px;cursor:pointer;padding:2px 6px;font-size:10px;opacity:0.8;transition:background 0.2s;`, onmouseover: () => dontShowBtn.style.background = t.b, onmouseout: () => dontShowBtn.style.background = 'transparent' }, "Don't show again");
        const closeToastBtn = hds_el('div', { className: 'hds-btn-close-toast', style: `cursor:pointer;font-size:20px;line-height:1;opacity:0.8;margin-left:8px;padding:0 4px;font-weight:bold;`, title: 'Close' }, '×');

        toast.appendChild(toastMsg);
        toast.appendChild(dontShowBtn);
        toast.appendChild(closeToastBtn);
        document.body.appendChild(toast);

        requestAnimationFrame(() => { toast.style.opacity = '1'; });

        const removeToast = () => {
            if (!toast.parentNode) return;
            toast.style.opacity = '0';
            setTimeout(() => { if (toast.parentNode) toast.remove(); }, 800);
        };

        let timeout = setTimeout(removeToast, 3000);

        closeToastBtn.onclick = () => {
            clearTimeout(timeout);
            removeToast();
        };

        toast.querySelector('.hds-btn-dont-show').onclick = () => {
            clearTimeout(timeout);
            globalState.hideF4Toast = true;
            saveState();
            removeToast();
        };
    };

    const updateLauncher = () => {
        const anyVisible = window.__hds.terminals.some(t => t.isVisible);
        launcher.style.display = (window.__hds.terminals.length === 0 || !anyVisible) ? 'flex' : 'none';
    };

    const handleF4 = (e) => {
        if (e.key === 'F4') {
            e.preventDefault(); e.stopImmediatePropagation();
            if (window.__hds.terminals.length === 0) {
                globalState.openIds = [0];
                new Terminal(0, globalState.configs[0] || {});
            } else {
                const anyVisible = window.__hds.terminals.some(t => t.isVisible);
                window.__hds.terminals.forEach(t => t.toggleVisibility(!anyVisible));
            }
            updateLauncher();
        }
    };
    window.addEventListener('keydown', handleF4, true);
    window.__hds.teardowns.push(() => window.removeEventListener('keydown', handleF4, true));
    window.__hds.teardowns.push(() => launcher.remove());

    class Terminal {
        constructor(id, initialState) {
            this.id = id;
            const defaults = {
                w: 650, h: 420,
                x: Math.max(20, window.innerWidth - 690),
                y: Math.max(20, window.innerHeight - 460),
                themeIdx: 0, fontIdx: 0, ts: true, alpha: 0.85, blur: 6, shell: 'bash', customShell: ''
            };
            this.state = JSON.parse(JSON.stringify({ ...defaults, ...initialState }));
            this.state.w = Math.max(400, Math.min(this.state.w, window.innerWidth - 40));
            this.state.h = Math.max(250, Math.min(this.state.h, window.innerHeight - 40));
            this.state.x = Math.max(0, Math.min(this.state.x, window.innerWidth - this.state.w));
            this.state.y = Math.max(0, Math.min(this.state.y, window.innerHeight - this.state.h));

            this.history = []; this.historyIndex = -1;
            this.isExecuting = false; this.isVisible = true;
            this.syncCycleIdx = 0; this.dlAliasIdx = 0;

            window.__hds.terminals.push(this);
            this.buildDOM(); this.bindEvents(); this.applyState();
            saveState(); updateLauncher(); this.bringToFront();
            setTimeout(() => this.input.focus(), 50);
        }

        bringToFront() {
            window.__hds.terminals.forEach(t => t.host.style.zIndex = '2147483640');
            this.host.style.zIndex = '2147483647';
        }

        buildDOM() {
            this.host = document.createElement('div');
            Object.assign(this.host.style, {
                position: 'fixed', top: '0', left: '0',
                transform: `translate3d(${this.state.x}px, ${this.state.y}px, 0)`,
                zIndex: '2147483647', pointerEvents: 'auto',
                transition: 'opacity 0.2s, visibility 0.2s'
            });
            document.body.appendChild(this.host);
            this.shadow = this.host.attachShadow({ mode: 'open' });

            const style = document.createElement('style');
            style.textContent = `
                * { box-sizing: border-box; }
                .term-container {
                    display: flex; flex-direction: column; 
                    width: ${this.state.w}px; height: ${this.state.h}px;
                    background: rgba(var(--bg-rgb), var(--bg-alpha));
                    backdrop-filter: blur(calc(var(--bg-blur) * 1px));
                    -webkit-backdrop-filter: blur(calc(var(--bg-blur) * 1px));
                    border: 1px solid var(--border); border-radius: 8px;
                    box-shadow: 0 16px 48px rgba(0,0,0,0.4); color: var(--text);
                    font-family: var(--font-family); font-size: 13px;
                    position: relative; min-width: 400px; min-height: 250px;
                    overflow: hidden; transition: background 0.2s, box-shadow 0.2s;
                    text-shadow: 0 1px 3px rgba(var(--shadow), calc((1 - var(--bg-alpha))*0.9)), 0 0 8px rgba(var(--shadow), calc((1 - var(--bg-alpha))*0.9));
                }
                .term-container.dragging {
                    backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
                    background: rgba(var(--bg-rgb), 1) !important;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
                    will-change: transform, width, height; transition: none !important;
                }
                .term-container.dragging .term-body, .term-container.dragging .term-input-wrapper, .term-container.dragging .term-env-bar { pointer-events: none !important; }
                .term-container:not(.show-timestamps) .term-timestamp { display: none !important; }
                
                .resizer { position: absolute; z-index: 10; touch-action: none; }
                .resizer[data-dir="n"] { top: 0; left: 8px; right: 8px; height: 6px; cursor: n-resize; }
                .resizer[data-dir="s"] { bottom: 0; left: 8px; right: 8px; height: 6px; cursor: s-resize; }
                .resizer[data-dir="e"] { top: 8px; bottom: 8px; right: 0; width: 6px; cursor: e-resize; }
                .resizer[data-dir="w"] { top: 8px; bottom: 8px; left: 0; width: 6px; cursor: w-resize; }
                .resizer[data-dir="nw"] { top: 0; left: 0; width: 10px; height: 10px; cursor: nw-resize; }
                .resizer[data-dir="ne"] { top: 0; right: 0; width: 10px; height: 10px; cursor: ne-resize; }
                .resizer[data-dir="sw"] { bottom: 0; left: 0; width: 10px; height: 10px; cursor: sw-resize; }
                .resizer[data-dir="se"] { bottom: 0; right: 0; width: 10px; height: 10px; cursor: se-resize; }
                .drag-edge { position: absolute; z-index: 11; touch-action: none; cursor: grab; background: transparent; }
                .drag-edge:active { cursor: grabbing; }
                .drag-edge[data-edge="n"] { top: 6px; left: 12px; right: 12px; height: 3px; }
                .drag-edge[data-edge="s"] { bottom: 6px; left: 12px; right: 12px; height: 3px; }
                .drag-edge[data-edge="e"] { top: 12px; bottom: 12px; right: 6px; width: 3px; }
                .drag-edge[data-edge="w"] { top: 12px; bottom: 12px; left: 6px; width: 3px; }
                
                .term-header {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 8px 12px; background: rgba(0,0,0,0.4);
                    border-bottom: 1px solid var(--border); cursor: grab; user-select: none; touch-action: none; text-shadow: none;
                    position: relative; z-index: 12;
                }
                .term-header:active { cursor: grabbing; }
                .term-title { font-weight: 600; display: flex; align-items: center; gap: 8px; pointer-events: none; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
                .term-status-dot { width: 8px; height: 8px; border-radius: 50%; background: #238636; }
                .term-status-dot.busy { background: #d29922; }
                .term-controls { display: flex; align-items: center; gap: 4px; }
                
                .icon-btn { cursor: pointer; opacity: 0.6; transition: all 0.1s; display: flex; align-items: center; justify-content: center; color: var(--text); padding: 4px; border-radius: 4px; background: transparent; border: none; outline: none; text-shadow: none; }
                .icon-btn:hover { opacity: 1; background: rgba(128,128,128,0.25); color: var(--prompt); }
                .icon-btn.active { opacity: 1; color: var(--prompt) !important; }
                
                .dropdown { position: relative; display: flex; align-items: center; }
                .dropdown-menu {
                    position: absolute; top: 100%; left: 0; background: rgba(var(--bg-rgb), 0.98);
                    border: 1px solid var(--border); display: none; flex-direction: column; z-index: 100;
                    min-width: 140px; box-shadow: 0 8px 24px rgba(0,0,0,0.6); border-radius: 6px; padding: 4px;
                    max-height: 280px; overflow-y: auto; overflow-x: hidden; font-size: 12px; margin-top: 4px; text-shadow: none; gap: 4px;
                }
                .dropdown.op .dropdown-menu { display: flex; }

                .dropdown-item { padding: 6px 10px; cursor: pointer; border-radius: 4px; transition: background 0.1s; display: flex; align-items: center; justify-content: space-between; white-space: nowrap; }
                .dropdown-item:hover { background: rgba(128,128,128,0.25); color: var(--prompt); }
                
                .slider-wrap { display: flex; align-items: center; gap: 4px; opacity: 0.7; padding: 0 4px; }
                .slider-wrap:hover { opacity: 1; }
                input[type="range"] { -webkit-appearance: none; background: rgba(128,128,128,0.4); border-radius: 2px; outline: none; cursor: pointer; height: 4px; width: 45px; transition: background 0.2s; }
                input[type="range"]:hover { background: rgba(128,128,128,0.6); }
                input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; border-radius: 50%; background: var(--text); width: 10px; height: 10px; transition: all 0.1s; }
                input[type="range"]:hover::-webkit-slider-thumb { background: var(--prompt); transform: scale(1.2); }
                
                .env-select-btn { display: flex; align-items: center; gap: 6px; padding: 4px 6px; border-radius: 4px; background: transparent; cursor: pointer; transition: all 0.2s; font-family: var(--font-family); color: var(--text); opacity: 0.8; }
                .env-select-btn:hover { opacity: 1; background: rgba(128,128,128,0.25); color: var(--prompt); }
                .env-custom-input { display: none; background: rgba(0,0,0,0.2); border: 1px solid var(--border); color: inherit; border-radius: 4px; padding: 4px 6px; font-size: 11px; outline: none; font-family: inherit; transition: all 0.2s; width: 90px; }
                .env-custom-input:focus { border-color: var(--prompt); }
                
                .term-body { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; contain: content; }
                .term-toast { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(var(--bg-rgb), 0.95); border: 1px solid var(--prompt); padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; opacity: 0; pointer-events: none; transition: opacity 0.2s; box-shadow: 0 8px 24px rgba(0,0,0,0.5); z-index: 20; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; text-shadow: none; }
                
                .execution-block { margin-bottom: 12px; background: rgba(0,0,0,0.15); border-radius: 6px; border: 1px solid rgba(128,128,128,0.2); transition: all 0.2s; contain: layout style; }
                .execution-block:hover { border-color: var(--prompt); background: rgba(0,0,0,0.3); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
                .block-header { display: flex; align-items: flex-start; gap: 8px; padding: 8px 12px; border-bottom: 1px dashed rgba(128,128,128,0.2); }
                .term-timestamp { opacity: 0.5; font-size: 10.5px; user-select: none; line-height: 20px; white-space: nowrap; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
                .term-container:not(.show-timestamps) .term-timestamp { display: none !important; }
                .block-cmd { color: var(--cmd); font-weight: 600; flex: 1; white-space: pre-wrap; word-break: break-all; line-height: 20px; }
                .copy-btn { background: transparent; border: none; color: inherit; cursor: pointer; opacity: 0; padding: 4px; border-radius: 4px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; text-shadow: none; }
                .execution-block:hover .copy-btn { opacity: 0.5; }
                .copy-btn:hover { opacity: 1 !important; color: var(--prompt); background: rgba(255,255,255,0.1); transform: scale(1.1); }
                .copy-cmd { margin-left: auto; margin-top: -2px; }
                
                .block-wrapper { position: relative; }
                .block-body { padding: 10px 12px; font-size: 12.5px; }
                .block-body:empty { display: none; }
                .raw-output { white-space: pre-wrap; word-break: break-all; line-height: 1.5; }
                .copy-output { position: absolute; top: 8px; right: 8px; z-index: 2; }
                .output-err { color: var(--err); }
                .term-footer { margin-top: 8px; font-style: italic; border-top: 1px dashed rgba(128,128,128,0.2); padding-top: 6px; text-align: left; display: block; opacity: 0.5; font-size: 10.5px; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; user-select: none; }
                
                .term-input-wrapper { display: flex; align-items: flex-start; padding: 10px 12px; background: rgba(0,0,0,0.25); border-top: 1px solid var(--border); gap: 8px; }
                .input-prompt { color: var(--prompt); font-weight: 600; line-height: 24px; padding-top: 2px; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; text-shadow: none; }
                .command-input { flex: 1; background: transparent; border: none; color: inherit; font-family: inherit; font-size: inherit; outline: none; margin: 0; padding: 2px 0; resize: none; max-height: 150px; overflow-y: auto; line-height: 24px; height: 28px; text-shadow: inherit; }
                .command-input::placeholder { color: rgba(255,255,255,0.3); }
                
                .send-btn { background: transparent; border: none; color: inherit; cursor: pointer; opacity: 0.6; padding: 4px; border-radius: 4px; transition: all 0.1s; display: flex; align-items: center; justify-content: center; margin-top: 2px; text-shadow: none; }
                .send-btn:hover { opacity: 1; background: rgba(128,128,128,0.25); color: var(--prompt); }
                .send-btn:disabled { opacity: 0.2; transform: none; cursor: not-allowed; background: transparent; }
                .btn-dl { margin-top: 2px; }
                
                ::-webkit-scrollbar { width: 8px; height: 8px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(128,128,128,0.6); }
                
                .dropdown-menu::-webkit-scrollbar { width: 10px; height: 10px; }
                .dropdown-menu::-webkit-scrollbar-track { background: rgba(0,0,0,0.15); border-radius: 5px; margin: 2px; }
                .dropdown-menu::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.6); border-radius: 5px; border: 2px solid transparent; background-clip: padding-box; }
                .dropdown-menu::-webkit-scrollbar-thumb:hover { background: rgba(128,128,128,0.9); border: 2px solid transparent; background-clip: padding-box; }
                .divider { width: 1px; height: 14px; background: var(--border); margin: 0 4px; }
            `;

            this.container = document.createElement('div');
            this.container.className = 'term-container';

            const cEl = (tag, cls, parent, txt) => {
                const e = document.createElement(tag);
                if (cls) e.className = cls;
                if (txt) e.textContent = txt;
                if (parent) parent.appendChild(e);
                return e;
            };

            ['n', 's', 'e', 'w', 'nw', 'ne', 'sw', 'se'].forEach(d => {
                const r = cEl('div', 'resizer', this.container); r.dataset.dir = d;
            });
            ['n', 's', 'e', 'w'].forEach(d => {
                const r = cEl('div', 'drag-edge', this.container); r.dataset.edge = d; r.title = 'Drag terminal';
            });

            const header = cEl('div', 'term-header', this.container);
            const titleDiv = cEl('div', 'term-title', header, `Hades [${this.id}]`);
            cEl('div', 'term-status-dot', titleDiv);

            const ctrlContainer = cEl('div', 'term-controls', header);
            const themeDrop = cEl('div', 'dropdown', ctrlContainer);
            const themeBtn = cEl('button', 'icon-btn btn-theme', themeDrop); themeBtn.appendChild(getIconTheme()); themeBtn.title = 'Theme';
            const themeMenu = cEl('div', 'dropdown-menu dd-theme', themeDrop);
            THEMES.forEach((t, i) => {
                const item = cEl('div', 'dropdown-item theme-item', themeMenu); item.dataset.idx = i; item.style.padding = '4px 6px';
                const inner = cEl('div', '', item); inner.style.cssText = `display:flex;align-items:center;background:rgb(${t.bg});padding:4px 8px;border-radius:4px;font-family:ui-monospace,SFMono-Regular,monospace;width:100%;justify-content:space-between;border:1px solid transparent;transition:border-color 0.1s;`;
                const name = cEl('span', '', inner, t.name); name.style.color = t.fg; name.style.fontSize = '11px';
                const r = cEl('div', '', inner); r.style.cssText = 'display:flex;gap:4px;align-items:center;';
                const c1 = cEl('div', '', r); c1.style.cssText = `width:6px;height:6px;border-radius:50%;background:${t.p}`;
                const c2 = cEl('div', '', r); c2.style.cssText = `width:6px;height:6px;border-radius:50%;background:${t.c}`;
            });

            const fontDrop = cEl('div', 'dropdown', ctrlContainer);
            const btnFont = cEl('button', 'icon-btn btn-font', fontDrop); btnFont.appendChild(getIconFont()); btnFont.title = 'Font';
            const fMenu = cEl('div', 'dropdown-menu dd-font', fontDrop);
            FONTS.forEach((f, i) => { const item = cEl('div', 'dropdown-item font-item', fMenu, f.name); item.dataset.idx = i; item.style.fontFamily = f.v; });

            const sDrop = cEl('div', 'dropdown', ctrlContainer);
            const sBtn = cEl('div', 'env-select-btn', sDrop);
            const sIcon = cEl('span', '', sBtn); sIcon.appendChild(getIconShell()); sIcon.style.cssText = 'display:flex;align-items:center;';
            cEl('span', 'shell-label', sBtn, 'bash');
            const sMenu = cEl('div', 'dropdown-menu dd-shell', sDrop);
            SHELLS.forEach(s => { const item = cEl('div', 'dropdown-item shell-item', sMenu, s); item.dataset.val = s; });
            const cInp = cEl('input', 'env-custom-input', ctrlContainer); cInp.type = 'text'; cInp.placeholder = 'Custom cmd...';

            cEl('div', 'divider', ctrlContainer);

            const btnTs = cEl('button', 'icon-btn btn-timestamp', ctrlContainer); btnTs.appendChild(getIconClock()); btnTs.title = 'Toggle Timestamps';
            const btnSync = cEl('button', 'icon-btn btn-sync', ctrlContainer); btnSync.appendChild(getIconSync()); btnSync.title = 'Sync with Environment';

            cEl('div', 'divider', ctrlContainer);

            const slidersContainer = cEl('div', 'sliders-container', ctrlContainer);
            slidersContainer.style.cssText = 'display:flex;gap:8px;padding:0 8px;align-items:center;';
            const sAlpha = cEl('div', 'slider-wrap', slidersContainer);
            const aIconWrap = cEl('span', '', sAlpha); aIconWrap.appendChild(getIconEye()); aIconWrap.style.cssText = 'display:flex;align-items:center;opacity:0.6;margin-right:2px;';
            const iAlpha = cEl('input', 'slider-alpha', sAlpha); iAlpha.type = 'range'; iAlpha.min = '0.3'; iAlpha.max = '1'; iAlpha.step = '0.05'; iAlpha.title = 'Opacity';
            const sBlur = cEl('div', 'slider-wrap', slidersContainer);
            const bIconWrap = cEl('span', '', sBlur); bIconWrap.appendChild(getIconDrop()); bIconWrap.style.cssText = 'display:flex;align-items:center;opacity:0.6;margin-right:2px;';
            const iBlur = cEl('input', 'slider-blur', sBlur); iBlur.type = 'range'; iBlur.min = '0'; iBlur.max = '20'; iBlur.step = '1'; iBlur.title = 'Blur';

            cEl('div', 'divider', ctrlContainer);
            const btnClear = cEl('button', 'icon-btn btn-clear', ctrlContainer); btnClear.appendChild(getIconTrash()); btnClear.title = isMac ? 'Clear (Ctrl+L)' : 'Clear (Alt+L)';
            const btnClone = cEl('button', 'icon-btn btn-clone', ctrlContainer); btnClone.appendChild(getIconPlus()); btnClone.title = 'New Terminal Window';
            const btnClose = cEl('button', 'icon-btn btn-close', ctrlContainer); btnClose.appendChild(getIconClose()); btnClose.title = 'Close Terminal';

            cEl('div', 'term-body', this.container);
            const toast = cEl('div', 'term-toast', this.container);
            const toastClose = cEl('span', 'toast-close', toast, '×');
            toastClose.onclick = () => toast.style.opacity = '0';

            const footer = cEl('div', 'term-input-wrapper', this.container);
            const btnDl = cEl('button', 'icon-btn btn-dl', footer); btnDl.appendChild(getIconDl()); btnDl.title = 'Download Mode';
            const termPrompt = cEl('div', 'input-prompt', footer, '>');
            const input = cEl('input', 'command-input', footer); input.type = 'text'; input.spellcheck = false; input.autocomplete = 'off'; input.placeholder = 'Command...';
            const sendBtn = cEl('button', 'send-btn', footer); sendBtn.appendChild(getIconArrowRight());

            this.shadow.appendChild(style);
            this.shadow.appendChild(this.container);

            this.header = this.shadow.querySelector('.term-header');
            this.body = this.shadow.querySelector('.term-body');
            this.input = this.shadow.querySelector('.command-input');
            this.statusDot = this.shadow.querySelector('.term-status-dot');
            this.alphaSlider = this.shadow.querySelector('.slider-alpha');
            this.blurSlider = this.shadow.querySelector('.slider-blur');
            this.shellLabel = this.shadow.querySelector('.shell-label');
            this.customShellInput = this.shadow.querySelector('.env-custom-input');
            this.sendBtn = this.shadow.querySelector('.send-btn');
            this.timestampBtn = this.shadow.querySelector('.btn-timestamp');
            this.dlBtn = this.shadow.querySelector('.btn-dl');
            this.clearBtn = this.shadow.querySelector('.btn-clear');
            this.resizers = this.shadow.querySelectorAll('.resizer');
            this.dragEdges = this.shadow.querySelectorAll('.drag-edge');
            this.toast = this.shadow.querySelector('.term-toast');
            this.syncBtn = this.shadow.querySelector('.btn-sync');

            this.syncBtn.addEventListener('mouseenter', () => this.updateSyncTooltip());
            this.updateSyncTooltip();
        }

        applyState() {
            const theme = THEMES[this.state.themeIdx] || THEMES[0];
            const font = FONTS[this.state.fontIdx] || FONTS[0];
            this.host.style.setProperty('--bg-rgb', theme.bg);
            this.host.style.setProperty('--text', theme.fg);
            this.host.style.setProperty('--prompt', theme.p);
            this.host.style.setProperty('--cmd', theme.c);
            this.host.style.setProperty('--err', theme.e);
            this.host.style.setProperty('--border', theme.b);
            this.host.style.setProperty('--shadow', theme.shd);
            this.host.style.setProperty('--font-family', font.v);
            this.host.style.setProperty('--bg-alpha', this.state.alpha);
            this.host.style.setProperty('--bg-blur', this.state.blur);

            this.alphaSlider.value = this.state.alpha;
            this.blurSlider.value = this.state.blur;

            this.container.classList.toggle('show-timestamps', this.state.ts);
            this.timestampBtn.classList.toggle('active', this.state.ts);

            this.shellLabel.textContent = this.state.shell;
            this.customShellInput.style.display = this.state.shell === 'custom' ? 'block' : 'none';
            this.customShellInput.value = this.state.customShell;

            this.shadow.querySelectorAll('.dropdown-menu .dropdown-item').forEach(i => i.style.opacity = '0.6');
            const activeTheme = this.shadow.querySelector(`.theme-item[data-idx="${this.state.themeIdx}"]`);
            if (activeTheme) activeTheme.style.opacity = '1';
            const activeFont = this.shadow.querySelector(`.font-item[data-idx="${this.state.fontIdx}"]`);
            if (activeFont) activeFont.style.opacity = '1';
            const activeShell = this.shadow.querySelector(`.shell-item[data-val="${this.state.shell}"]`);
            if (activeShell) activeShell.style.opacity = '1';
        }

        updateSyncTooltip() {
            if (!this.syncBtn) return;
            const others = window.__hds.terminals.filter(t => t.id !== this.id).sort((a, b) => a.id - b.id);
            const cyclePos = this.syncCycleIdx % (others.length + 1);
            if (cyclePos < others.length) {
                this.syncBtn.title = `Sync display settings from Terminal [${others[cyclePos].id}]`;
            } else {
                this.syncBtn.title = `Restore default display settings`;
            }
        }

        toggleVisibility(force) {
            this.isVisible = force !== undefined ? force : !this.isVisible;
            this.host.style.opacity = this.isVisible ? '1' : '0';
            this.host.style.pointerEvents = this.isVisible ? 'auto' : 'none';
            if (this.isVisible) {
                this.bringToFront();
                setTimeout(() => this.input.focus(), 100);
            }
        }

        showToast(msg) {
            this.toast.textContent = msg;
            this.toast.style.opacity = '1';
            clearTimeout(this.toastTimeout);
            this.toastTimeout = setTimeout(() => this.toast.style.opacity = '0', 1200);
        }

        getTimestamp() {
            const d = new Date(), p = n => n.toString().padStart(2, '0');
            return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
        }

        bindCopyButton(btn, textFn) {
            btn.addEventListener('click', () => {
                navigator.clipboard.writeText(textFn()).catch(() => { });
                btn.replaceChildren(getIconCheck());
                setTimeout(() => btn.replaceChildren(getIconCopy()), 2000);
            });
        }

        closeDropdowns() {
            this.shadow.querySelectorAll('.dropdown.op, .dropdown-menu.op').forEach(d => d.classList.remove('op'));
        }

        handleDynamicInput() {
            const val = this.input.value.trimStart();
            const firstWord = val.split(/\s+/)[0];
            const newPh = DL_ALIASES.includes(firstWord) ? "Enter file path to yoink..." : "Command... (Shift+Enter for newline)";
            if (this.input.placeholder !== newPh) this.input.placeholder = newPh;
        }

        bindEvents() {
            const stopPropagation = (e) => {
                if (e.key === 'F4') return;
                e.stopPropagation();
            };

            ['keydown', 'keyup', 'keypress', 'mousedown', 'mouseup', 'click', 'contextmenu'].forEach(ev => {
                this.host.addEventListener(ev, stopPropagation);
            });

            this.input.addEventListener('keydown', (e) => {
                if (this.isExecuting) {
                    if (e.key === 'c' && e.ctrlKey) {
                        e.preventDefault(); e.stopImmediatePropagation();
                        if (this.abortController) this.abortController.abort();
                    } else if (['Enter', 'ArrowUp', 'ArrowDown'].includes(e.key) && !e.shiftKey) {
                        e.preventDefault(); e.stopImmediatePropagation();
                    }
                    return;
                }

                if ((e.key === 'Enter' || e.keyCode === 13) && !e.shiftKey) {
                    e.preventDefault(); e.stopImmediatePropagation();
                    this.submitCommand();
                } else if (e.key === 'ArrowUp' && !this.input.value.includes('\n')) {
                    e.preventDefault(); e.stopImmediatePropagation();
                    if (this.historyIndex === this.history.length) this.currentInput = this.input.value;
                    if (this.historyIndex > 0) { this.input.value = this.history[--this.historyIndex]; this.handleDynamicInput(); }
                } else if (e.key === 'ArrowDown' && !this.input.value.includes('\n')) {
                    e.preventDefault(); e.stopImmediatePropagation();
                    if (this.historyIndex < this.history.length - 1) { this.input.value = this.history[++this.historyIndex]; this.handleDynamicInput(); }
                    else if (this.historyIndex === this.history.length - 1) { this.historyIndex++; this.input.value = this.currentInput; this.handleDynamicInput(); }
                } else if (e.key.toLowerCase() === 'l' && ((!isMac && e.altKey) || (isMac && e.ctrlKey))) {
                    e.preventDefault(); e.stopImmediatePropagation();
                    this.body.replaceChildren();
                } else if (e.key === 'c' && e.ctrlKey && this.input.selectionStart === this.input.selectionEnd) {
                    e.preventDefault(); e.stopImmediatePropagation();
                    this.createBlock(`${this.input.value}^C`).rawOut.textContent = '';
                    this.input.value = ''; this.handleDynamicInput(); this.historyIndex = this.history.length;
                }
            });

            this.input.addEventListener('input', () => this.handleDynamicInput());

            this.globalPointerDown = (e) => {
                if (!e.composedPath().includes(this.host)) {
                    this.closeDropdowns();
                }
            };
            window.addEventListener('pointerdown', this.globalPointerDown, true);

            this.host.addEventListener('pointerdown', (e) => {
                this.bringToFront();
                // e.target is retargeted to the host across the shadow boundary, so
                // closest() can't see the dropdown; composedPath() walks the real path.
                if (!e.composedPath().some(el => el.classList && el.classList.contains('dropdown'))) this.closeDropdowns();
            });

            const setupDropdownBtn = (btnSelector, ddSelector, cycleCallback) => {
                const btn = this.shadow.querySelector(btnSelector);
                const dd = this.shadow.querySelector(ddSelector);
                if (!btn || !dd) return;
                const container = dd.closest('.dropdown') || dd;

                if (cycleCallback) {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault(); e.stopPropagation(); this.closeDropdowns();
                        cycleCallback();
                    });
                } else {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault(); e.stopPropagation();
                        const wasOp = container.classList.contains('op');
                        this.closeDropdowns();
                        if (!wasOp) container.classList.add('op');
                    });
                }

                btn.addEventListener('contextmenu', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    const wasOp = container.classList.contains('op');
                    this.closeDropdowns();
                    if (!wasOp) container.classList.add('op');
                });
            };

            setupDropdownBtn('.btn-theme', '.dd-theme', () => {
                this.state.themeIdx = (this.state.themeIdx + 1) % THEMES.length;
                this.applyState(); saveState(); this.showToast(`Theme: ${THEMES[this.state.themeIdx].name}`);
            });

            setupDropdownBtn('.btn-font', '.dd-font', () => {
                this.state.fontIdx = (this.state.fontIdx + 1) % FONTS.length;
                this.applyState(); this.resizeInput(); saveState(); this.showToast(`Font: ${FONTS[this.state.fontIdx].name}`);
            });

            setupDropdownBtn('.env-select-btn', '.dd-shell', null);

            this.shadow.querySelectorAll('.theme-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    this.state.themeIdx = parseInt(item.dataset.idx);
                    this.applyState(); saveState(); this.closeDropdowns();
                });
            });

            this.shadow.querySelectorAll('.font-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    this.state.fontIdx = parseInt(item.dataset.idx);
                    this.applyState(); this.resizeInput(); saveState(); this.closeDropdowns();
                });
            });

            this.shadow.querySelectorAll('.shell-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    this.state.shell = item.dataset.val;
                    this.applyState(); saveState();
                    if (this.state.shell === 'custom') this.customShellInput.focus();
                    this.closeDropdowns();
                });
            });

            this.shadow.querySelector('.btn-clear').addEventListener('click', () => {
                this.body.replaceChildren();
            });

            this.dlBtn.addEventListener('click', () => {
                const alias = DL_ALIASES[this.dlAliasIdx % 3];
                this.dlAliasIdx++;
                this.input.value = `${alias} `;
                this.handleDynamicInput();
                this.input.focus();
            });

            this.customShellInput.addEventListener('input', (e) => {
                this.state.customShell = e.target.value; saveState();
            });
            this.customShellInput.addEventListener('pointerdown', e => e.stopPropagation());

            this.shadow.querySelector('.btn-clone').addEventListener('click', () => {
                let newId = 0;
                while (globalState.openIds.includes(newId)) newId++;
                let st = { ...this.state, x: this.state.x + 30, y: this.state.y + 30 };
                globalState.openIds.push(newId);
                new Terminal(newId, st);
            });

            this.shadow.querySelector('.btn-sync').addEventListener('click', () => {
                const others = window.__hds.terminals.filter(t => t.id !== this.id).sort((a, b) => a.id - b.id);
                const cyclePos = this.syncCycleIdx % (others.length + 1);
                this.syncCycleIdx++;

                let targetState; let targetName;

                if (cyclePos < others.length) {
                    const target = others[cyclePos];
                    targetState = target.state; targetName = `Terminal [${target.id}]`;
                } else {
                    targetState = { themeIdx: 0, fontIdx: 0, ts: true, alpha: 0.85, blur: 6, shell: 'bash', customShell: '' };
                    targetName = `Defaults`;
                }

                ['themeIdx', 'fontIdx', 'ts', 'alpha', 'blur', 'shell', 'customShell'].forEach(k => {
                    this.state[k] = targetState[k] !== undefined ? targetState[k] : this.state[k];
                });

                this.applyState(); this.resizeInput(); saveState();
                this.showToast(targetName === 'Defaults' ? 'Restored default display settings' : `Synced to ${targetName}`);
                this.updateSyncTooltip();
            });

            this.shadow.querySelector('.btn-close').addEventListener('click', () => {
                if (this.abortController) this.abortController.abort();
                this.host.remove();
                window.__hds.terminals = window.__hds.terminals.filter(t => t !== this);
                globalState.openIds = globalState.openIds.filter(id => id !== this.id);

                if (this.id !== 0) delete globalState.configs[this.id];
                saveState(); updateLauncher();
            });

            this.timestampBtn.addEventListener('click', () => {
                this.state.ts = !this.state.ts; this.applyState(); saveState();
            });

            this.alphaSlider.addEventListener('input', (e) => {
                this.state.alpha = e.target.value; this.applyState(); saveState();
            });

            this.blurSlider.addEventListener('input', (e) => {
                this.state.blur = e.target.value; this.applyState(); saveState();
            });

            this.resizers.forEach(resizer => {
                resizer.addEventListener('pointerdown', (e) => {
                    e.stopPropagation(); this.closeDropdowns(); this.bringToFront();
                    const dir = resizer.dataset.dir;
                    let startX = e.clientX, startY = e.clientY;
                    let startW = this.state.w, startH = this.state.h, startPosX = this.state.x, startPosY = this.state.y;

                    this.container.classList.add('dragging');
                    try { resizer.setPointerCapture(e.pointerId); } catch (err) { }

                    let reqFrame = null;
                    const onMove = (ev) => {
                        let dx = ev.clientX - startX, dy = ev.clientY - startY;
                        let newW = startW, newH = startH, newX = startPosX, newY = startPosY;
                        if (dir.includes('e')) newW = Math.max(400, startW + dx);
                        if (dir.includes('s')) newH = Math.max(250, startH + dy);
                        if (dir.includes('w')) { newW = Math.max(400, startW - dx); newX = startPosX + (startW - newW); }
                        if (dir.includes('n')) { newH = Math.max(250, startH - dy); newY = startPosY + (startH - newH); }

                        if (!reqFrame) {
                            reqFrame = requestAnimationFrame(() => {
                                this.container.style.width = `${newW}px`; this.container.style.height = `${newH}px`;
                                this.host.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
                                this.state.x = newX; this.state.y = newY; this.state.w = newW; this.state.h = newH;
                                reqFrame = null;
                            });
                        }
                    };

                    const onUp = (ev) => {
                        this.container.classList.remove('dragging');
                        if (reqFrame) { cancelAnimationFrame(reqFrame); reqFrame = null; }
                        try { resizer.releasePointerCapture(ev.pointerId); } catch (err) { }
                        window.removeEventListener('pointermove', onMove);
                        window.removeEventListener('pointerup', onUp);
                        window.removeEventListener('pointercancel', onUp);
                        saveState();
                    };

                    window.addEventListener('pointermove', onMove);
                    window.addEventListener('pointerup', onUp);
                    window.addEventListener('pointercancel', onUp);
                });
            });

            let isDragging = false, dragStartX, dragStartY, dragStartPosX, dragStartPosY, dragCaptureTarget = null;
            const onDragMove = (e) => {
                if (!isDragging) return;
                let targetX = dragStartPosX + (e.clientX - dragStartX), targetY = dragStartPosY + (e.clientY - dragStartY);
                if (!this.reqFrameDrag) {
                    this.reqFrameDrag = requestAnimationFrame(() => {
                        this.state.x = Math.max(-this.state.w + 60, Math.min(targetX, window.innerWidth - 60));
                        this.state.y = Math.max(0, Math.min(targetY, window.innerHeight - 40));
                        this.host.style.transform = `translate3d(${this.state.x}px, ${this.state.y}px, 0)`;
                        this.reqFrameDrag = null;
                    });
                }
            };
            const onDragUp = (e) => {
                if (!isDragging) return; isDragging = false; this.container.classList.remove('dragging');
                if (this.reqFrameDrag) { cancelAnimationFrame(this.reqFrameDrag); this.reqFrameDrag = null; }
                try { if (dragCaptureTarget) dragCaptureTarget.releasePointerCapture(e.pointerId); } catch (err) { }
                dragCaptureTarget = null;
                window.removeEventListener('pointermove', onDragMove);
                window.removeEventListener('pointerup', onDragUp);
                window.removeEventListener('pointercancel', onDragUp);
                saveState();
            };

            const startDrag = (e, captureTarget) => {
                this.closeDropdowns(); this.bringToFront();
                isDragging = true; dragStartX = e.clientX; dragStartY = e.clientY;
                dragStartPosX = this.state.x; dragStartPosY = this.state.y;
                this.container.classList.add('dragging');
                dragCaptureTarget = captureTarget;
                try { captureTarget.setPointerCapture(e.pointerId); } catch (err) { }
                window.addEventListener('pointermove', onDragMove);
                window.addEventListener('pointerup', onDragUp);
                window.addEventListener('pointercancel', onDragUp);
            };

            this.header.addEventListener('pointerdown', (e) => {
                if (e.target.closest('.term-controls')) return;
                startDrag(e, this.header);
            });

            this.dragEdges.forEach(edge => {
                edge.addEventListener('pointerdown', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    startDrag(e, edge);
                });
            });

            this.sendBtn.addEventListener('click', () => this.submitCommand());
            this.body.addEventListener('click', () => {
                const selection = this.shadow.getSelection ? this.shadow.getSelection() : window.getSelection();
                if (!selection || selection.toString().length === 0) this.input.focus();
            });

            this.host.__teardown = (isReload = false) => {
                window.removeEventListener('pointerdown', this.globalPointerDown, true);
                this.destroy(isReload);
            };
        }

        resizeInput() {
            // No-op for input type="text" to prevent expensive layout reflows
        }

        createBlock(commandStr) {
            const block = document.createElement('div'); block.className = 'execution-block';
            const header = document.createElement('div'); header.className = 'block-header';
            header.appendChild(hds_el('span', { className: 'term-timestamp' }, `[${this.getTimestamp()}]`));
            header.appendChild(hds_el('span', { className: 'block-cmd' }, `❯ ${commandStr.split('\n').join('\n  ')}`));

            const copyCmdBtn = document.createElement('button'); copyCmdBtn.className = 'copy-btn copy-cmd'; copyCmdBtn.appendChild(getIconCopy());
            this.bindCopyButton(copyCmdBtn, () => commandStr); header.appendChild(copyCmdBtn);

            const blockWrapper = document.createElement('div'); blockWrapper.className = 'block-wrapper';
            const blockBody = document.createElement('div'); blockBody.className = 'block-body';
            const rawOut = document.createElement('div'); rawOut.className = 'raw-output'; blockBody.appendChild(rawOut);

            const copyOutBtn = document.createElement('button'); copyOutBtn.className = 'copy-btn copy-output'; copyOutBtn.appendChild(getIconCopy()); copyOutBtn.style.display = 'none';
            this.bindCopyButton(copyOutBtn, () => rawOut.textContent);

            blockWrapper.appendChild(blockBody); blockWrapper.appendChild(copyOutBtn);
            block.appendChild(header); block.appendChild(blockWrapper); this.body.appendChild(block);

            while (this.body.childElementCount > 100) this.body.firstChild.remove();
            this.body.scrollTop = this.body.scrollHeight;

            return { blockBody, rawOut, copyOutBtn };
        }

        formatErrorValue(value) {
            if (typeof value === 'string') return value;
            try { return JSON.stringify(value, null, 2); } catch (e) { return String(value); }
        }

        formatHttpError(status, statusText, bodyText) {
            const statusLine = `HTTP ${status}${statusText ? ` ${statusText}` : ''}`;
            const trimmedBody = (bodyText || '').trim();
            if (!trimmedBody) return statusLine;

            let body;
            try { body = JSON.parse(trimmedBody); } catch (e) { return `${statusLine}\nResponse: ${trimmedBody}`; }
            if (!body || typeof body !== 'object') return `${statusLine}\nResponse: ${this.formatErrorValue(body)}`;

            const isEmpty = (v) => v == null
                || (typeof v === 'string' && v.trim() === '')
                || (typeof v === 'object' && Object.keys(v).length === 0);
            const present = (key) => Object.prototype.hasOwnProperty.call(body, key) && !isEmpty(body[key]);

            // Fold a scalar code and a single-line message into the status line; keep
            // details and anything structured or multi-line on their own lines.
            const foldCode = present('code') && typeof body.code !== 'object';
            const foldMsg = present('message') && typeof body.message === 'string' && !body.message.includes('\n');

            let head = statusLine;
            if (foldCode) head += ` (code ${body.code})`;
            if (foldMsg) head += `: ${body.message}`;

            const lines = [head];
            if (present('code') && !foldCode) lines.push(`Code: ${this.formatErrorValue(body.code)}`);
            if (present('message') && !foldMsg) lines.push(`Message: ${this.formatErrorValue(body.message)}`);
            if (present('details')) lines.push(`Details: ${this.formatErrorValue(body.details)}`);

            if (!present('code') && !present('message') && !present('details')
                && !Object.keys(body).every(k => isEmpty(body[k]))) {
                lines.push(`Response: ${this.formatErrorValue(body)}`);
            }

            return lines.join('\n');
        }

        async req(lang, code, signal) {
            const reqId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); });
            const res = await fetch("https://grok.com/rest/app-chat/run-code", {
                method: "POST", credentials: "include", signal,
                headers: { "Content-Type": "application/json", "Accept": "*/*", "x-xai-request-id": reqId },
                body: JSON.stringify({ language: lang, code: code + "\n" })
            });
            const bodyText = await res.text();
            if (!res.ok) {
                const err = new Error(this.formatHttpError(res.status, res.statusText, bodyText));
                err.name = 'HttpError';
                err.httpStatus = res.status;
                throw err;
            }
            try { return JSON.parse(bodyText); } catch (e) { throw new Error(`Invalid JSON Response.`); }
        }

        async download(filePath, { blockBody, rawOut }) {
            this.isExecuting = true; this.input.disabled = true; this.sendBtn.disabled = true; this.dlBtn.disabled = true; this.statusDot.classList.add('busy');
            this.abortController = new AbortController(); const startTime = performance.now();
            let byteArrays = [];

            try {
                const escPath = filePath.replace(/'/g, "'\\''");
                const initCmd = `if [ -d '${escPath}' ]; then echo "IS_DIR"; elif [ -r '${escPath}' ]; then stat -c %s '${escPath}'; sha256sum '${escPath}' | awk '{print $1}'; else echo "NOT_FOUND"; fi`;
                const initRes = await this.req('bash', initCmd, this.abortController.signal);

                const outLines = (initRes.stdout || '').trim().split('\n').map(l => l.trim()).filter(Boolean);
                if (outLines[0] === "IS_DIR") throw new Error(`Cannot yoink an entire directory: ${filePath}`);
                if (outLines[0] === "NOT_FOUND" || outLines.length < 2 || isNaN(parseInt(outLines[0]))) {
                    throw new Error(`File not found or inaccessible: ${filePath}`);
                }

                const size = parseInt(outLines[0]);
                const serverHash = outLines[1];
                if (size === 0) throw new Error("File is empty, nice try.");

                const CHUNK_SIZE = 60 * 1024;
                const totalChunks = Math.ceil(size / CHUNK_SIZE);

                const metaDiv = document.createElement('div');
                metaDiv.style.marginBottom = '6px';
                metaDiv.textContent = `Yoinking ${filePath.split('/').pop()} (${(size / 1024 / 1024).toFixed(2)} MB)`;
                rawOut.appendChild(metaDiv);

                const progDiv = document.createElement('div');
                progDiv.style.fontFamily = 'ui-monospace, SFMono-Regular, Consolas, monospace';
                rawOut.appendChild(progDiv);

                const updateProg = (c) => {
                    const pct = Math.floor((c / totalChunks) * 100);
                    const bars = Math.floor(pct / 5);
                    progDiv.textContent = `[${'█'.repeat(bars)}${'░'.repeat(20 - bars)}] ${pct}% (${c}/${totalChunks} chunks)`;
                };
                updateProg(0);

                for (let n = 0; n < totalChunks; n++) {
                    const chunkCmd = `dd if='${escPath}' bs=60K skip=${n} count=1 iflag=fullblock status=none 2>/dev/null | base64 -w0\n`;
                    const chunkRes = await this.req('bash', chunkCmd, this.abortController.signal);
                    if (!chunkRes.success && !chunkRes.stdout) throw new Error(`Failed to read chunk ${n}.`);

                    const chunkOut = (chunkRes.stdout || '').replace(/\s/g, '').replace(/✅$/, '');
                    if (chunkOut) {
                        const binStr = atob(chunkOut);
                        const byteNums = new Uint8Array(binStr.length);
                        for (let j = 0; j < binStr.length; j++) byteNums[j] = binStr.charCodeAt(j);
                        byteArrays.push(byteNums);
                    }
                    updateProg(n + 1);

                    await new Promise(r => setTimeout(r, 50));
                }

                progDiv.textContent = `[████████████████████] 100% (${totalChunks}/${totalChunks} chunks)\nStitching chunks & verifying SHA256...`;

                const blob = new Blob(byteArrays);
                const arrayBuffer = await blob.arrayBuffer();
                const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const clientHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = filePath.split('/').pop() || 'downloaded_file';
                a.style.display = 'none'; document.body.appendChild(a); a.click();
                setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);

                const hashResMsg = clientHash === serverHash
                    ? `\n<span style="color:var(--prompt)">✅ SHA256 matched: ${clientHash}</span>`
                    : `\n<span style="color:var(--err)">❌ SHA256 mismatch!\n   Expected: ${serverHash}\n   Got:      ${clientHash}</span>`;

                progDiv.textContent = `[████████████████████] 100% - Yoink complete.${hashResMsg}`;
            } catch (err) {
                const span = document.createElement('span'); span.className = 'output-err';
                span.textContent = err.name === 'AbortError' ? "Yoink aborted.\n" : `❌ ${err.message}\n`; rawOut.appendChild(span);
            } finally {
                const duration = ((performance.now() - startTime) / 1000).toFixed(2);
                const footer = document.createElement('div'); footer.className = 'term-footer';
                footer.textContent = `[${this.getTimestamp()}] - yoink took ${duration}s`;
                blockBody.appendChild(footer);

                this.body.scrollTop = this.body.scrollHeight; this.isExecuting = false; this.input.disabled = false; this.sendBtn.disabled = false; this.dlBtn.disabled = false;
                this.statusDot.classList.remove('busy'); this.abortController = null; setTimeout(() => this.input.focus(), 10);
            }
        }

        async submitCommand() {
            if (this.isExecuting) return;
            const command = this.input.value.trim();
            if (!command) return;

            this.input.value = ''; this.handleDynamicInput();
            if (command === 'clear') { this.body.replaceChildren(); return; }
            if (command === 'exit') { this.shadow.querySelector('.btn-close').click(); return; }
            if (this.history[this.history.length - 1] !== command) this.history.push(command);
            this.historyIndex = this.history.length;

            const parts = command.split(/\s+/);
            if (DL_ALIASES.includes(parts[0])) {
                if (parts.length > 1) {
                    const filePath = command.substring(parts[0].length).trim();
                    const targetNodes = this.createBlock(command);
                    await this.download(filePath, targetNodes);
                } else {
                    const targetNodes = this.createBlock(command);
                    const span = document.createElement('span'); span.className = 'output-err';
                    span.textContent = `❌ Usage: ${parts[0]} <FILEPATH>\n`;
                    targetNodes.rawOut.appendChild(span);
                    const footer = document.createElement('div'); footer.className = 'term-footer';
                    footer.textContent = `[${this.getTimestamp()}] - took 0.00s`;
                    targetNodes.blockBody.appendChild(footer);
                    this.body.scrollTop = this.body.scrollHeight;
                }
                return;
            }

            const targetNodes = this.createBlock(command);
            await this.execute(command, targetNodes);
        }

        async execute(command, { blockBody, rawOut, copyOutBtn }) {
            this.isExecuting = true; this.input.disabled = true; this.sendBtn.disabled = true; this.dlBtn.disabled = true; this.statusDot.classList.add('busy');
            let lang = this.state.shell; if (lang === 'custom') lang = this.state.customShell.trim() || 'bash';
            this.abortController = new AbortController(); const timeout = setTimeout(() => this.abortController.abort(), 60000); const startTime = performance.now();

            try {
                const data = await this.req(lang, command, this.abortController.signal);
                clearTimeout(timeout);

                let hasOutput = false;
                const appendOutput = (text, isError) => {
                    if (text.trim() === "✅") return;
                    const span = document.createElement('span'); if (isError) span.className = 'output-err';
                    span.textContent = text.replace(/\n$/, '') + '\n'; rawOut.appendChild(span); hasOutput = true;
                };

                if (data.stdout) appendOutput(String(data.stdout), false);
                if (data.stderr) appendOutput(String(data.stderr), true);
                if (data.error) appendOutput(String(data.error), true);
                if (data.pyerror) appendOutput(String(data.pyerror), true);
                if (data.ret && data.ret !== 'None') appendOutput(String(data.ret), false);
                if (!hasOutput && !data.success) appendOutput("Process died with error code.", true);
            } catch (error) {
                clearTimeout(timeout); const span = document.createElement('span'); span.className = 'output-err';
                span.textContent = error.name === 'AbortError' ? "Execution interrupted.\n" : `${error.message}\n`; rawOut.appendChild(span);
            } finally {
                const duration = ((performance.now() - startTime) / 1000).toFixed(2);
                if (rawOut.textContent.trim()) {
                    const footer = document.createElement('div'); footer.className = 'term-footer';
                    footer.textContent = `[${this.getTimestamp()}] - took ${duration}s`;
                    blockBody.appendChild(footer); copyOutBtn.style.display = 'flex';
                } else { blockBody.parentNode.remove(); }

                this.body.scrollTop = this.body.scrollHeight; this.isExecuting = false; this.input.disabled = false; this.sendBtn.disabled = false; this.dlBtn.disabled = false;
                this.statusDot.classList.remove('busy'); this.abortController = null; setTimeout(() => this.input.focus(), 10);
            }
        }

        destroy(isReload = false) {
            if (this.abortController) this.abortController.abort();
            if (this.reqFrameDrag) cancelAnimationFrame(this.reqFrameDrag);
            this.host.remove();

            if (!isReload) {
                window.__hds.terminals = window.__hds.terminals.filter(t => t !== this);
                globalState.openIds = globalState.openIds.filter(id => id !== this.id);
                if (this.id !== 0) delete globalState.configs[this.id];
                saveState(); updateLauncher();
            }
        }
    }

    window.__hds.spawn = () => {
        const nextId = window.__hds.terminals.length > 0 ? Math.max(...window.__hds.terminals.map(t => t.id)) + 1 : 0;
        if (!globalState.openIds.includes(nextId)) globalState.openIds.push(nextId);
        let st = globalState.configs[nextId] || globalState.configs[0] || {};
        if (!globalState.configs[nextId] && window.__hds.terminals.length > 0) {
            const last = window.__hds.terminals[window.__hds.terminals.length - 1];
            st = { ...st, x: last.state.x + 30, y: last.state.y + 30 };
        }
        new Terminal(nextId, st);
        saveState();
        updateLauncher();
    };

    if (!globalState.openIds || globalState.openIds.length === 0) {
        globalState.openIds = [0];
        if (!globalState.configs) globalState.configs = {};
    }

    globalState.openIds.forEach(id => {
        new Terminal(id, globalState.configs[id] || {});
    });
})();
