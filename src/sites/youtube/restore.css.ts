import type { SelectorData } from "../../core/schema";
export function buildCss(data: SelectorData): string {
  const c = data.containers;
  const base = 'html[data-undo-yt="on"][data-undo-yt-layout="new"]';
  const root = `${base} ytd-watch-flexy:not([fullscreen]):not([hidden]):not([is-miniplayer])`;
  const scope = (s: string) => `${root} :is(${s})`;
  const flagged = (flag: string, s: string) =>
    scope(s).replace(base, `${base}[${flag}]`);
  return `
html[data-undo-yt-pending] ytd-watch-flexy {animation:undo-reveal .3s step-end forwards;}
@keyframes undo-reveal {from {visibility:hidden} to {visibility:visible}}
${scope(c.sideRail)},${scope(c.splitSpacer)} {display:none !important;}
${scope(c.commentsPanel)} {display:none !important;}
${base} #undo-miniplayer svg {vertical-align:middle;pointer-events:none;}
${root} .ytp-size-button, ${root} #undo-miniplayer {display:inline-block !important;}
${base} ytd-watch-flexy[fullscreen] #undo-miniplayer {display:none !important;}
${scope(c.recommendationItems)} {display:flex !important;flex-direction:column !important;gap:12px !important;}
${scope(c.recommendationCard)} {display:flex !important;flex-direction:row !important;gap:8px !important;width:100% !important;max-width:100% !important;}
${scope(c.recommendationImage)} {flex:0 0 168px !important;width:168px !important;}
${scope(c.recommendationDetails)} {min-width:0;flex:1;}
${flagged("data-undo-yt-hide-ai", c.aiSearchEntry)} {display:none !important;}
${flagged("data-undo-yt-shield", c.comments)} {display:none !important;}
${root} #undo-show-comments {padding:14px 18px;margin-block:20px;border:1px solid currentColor;border-radius:2px;background:transparent;color:inherit;font:inherit;cursor:pointer;text-align:start;width:100%;}
${root} #undo-show-comments:focus-visible {outline:3px solid currentColor;outline-offset:3px;}
@media(min-width:1921px) {
${root.replace(base, `${base}[data-undo-yt-width="fill"]`)}:not([theater]) {--ytd-watch-flexy-max-player-width:100vw !important;}
${flagged('data-undo-yt-width="fill"', c.columns)} {max-width:none !important;}
${root.replace(base, `${base}[data-undo-yt-width="cap"]`)}:not([theater]) {--ytd-watch-flexy-max-player-width:1280px !important;}
${flagged('data-undo-yt-width="cap"', c.columns)} {max-width:1740px !important;margin-inline:auto !important;}
}
`;
}
