from pathlib import Path
import re
t = Path('roadmap.html').read_text(encoding='utf-8')
# find week/session blocks
for m in re.finditer(r'.{0,80}(Flex|flex|Position|position|Stacking|회차|Week|week|발표|presenter).{0,80}', t):
    s = m.group(0).replace('\n',' ')
    if len(s) > 20:
        print(m.start(), s[:160])
        print('---')
