import { useEffect } from 'react';

const Comments: React.FC = () => {
  useEffect(() => {
    let script = document.createElement('script');
    let anchor = document.getElementById('inject-comments-for-uterances');
    script.setAttribute('src', 'https://utteranc.es/client.js');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', 'true');
    script.setAttribute('repo', 'IsaacMaciel/spacetravelling-Ignite');
    script.setAttribute('issue-term', 'url');
    script.setAttribute('theme', 'photon-dark');
    anchor.appendChild(script);
  }, []);

  return (
    <div style={{maxWidth: '43.75rem'}}>
      <div id="inject-comments-for-uterances" />
    </div>
  );
};

export { Comments };
