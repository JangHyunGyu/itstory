from pathlib import Path
import re
t = Path('roadmap.html').read_text(encoding='utf-8')
# find presenter-related HTML
for pat in ['presenter', 'ai-row', 'week-cell', 'data-week', 'speakers', 'assign']:
    print('===', pat, t.lower().count(pat.lower()))
# dump a chunk around first presenter counter usage in HTML body
idx = t.find('counter-reset: presenter')
# find body content with class containing presenter
ms = list(re.finditer(r'class="[^"]*presenter[^"]*"', t))
print('presenter classes', len(ms))
for m in ms[:10]:
    print(t[m.start()-50:m.start()+200].replace('\n',' ')[:220])
# look for list of topics in JS
for m in re.finditer(r'(topics|weeks|sessions|roadmap)\s*=\s*\[', t):
    print('array at', m.start(), t[m.start():m.start()+300][:300])
