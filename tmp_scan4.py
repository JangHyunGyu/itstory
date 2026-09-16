from pathlib import Path
import re
t = Path('roadmap.html').read_text(encoding='utf-8')
# thead
m = re.search(r'<thead>.*?</thead>', t, re.S)
print('THEAD:')
print(m.group(0)[:1500] if m else 'none')
# week 06-08 rows
for week in ['06','07','08']:
    pat = rf'<th class="week-cell" scope="row"><span>회차</span>{week}</th>.*?(?=<th class="week-cell"|</tbody>)'
    m = re.search(pat, t, re.S)
    print('\n==== WEEK', week, '====')
    print(m.group(0)[:1200] if m else 'missing')
# presenter styles section
i = t.find('counter-reset: presenter')
print('\nPRESENTER CSS nearby:')
print(t[i-200:i+800])
