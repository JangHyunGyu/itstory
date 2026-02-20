import re

with open('c:/workspace/itstory/was.html', 'r', encoding='utf-8') as f:
    html = f.read()

matches = re.findall(r'<div class="event-detail__(?:story|notes)">.*?</div>', html, re.DOTALL)
for i, m in enumerate(matches):
    print(f'--- Match {i} ---')
    print(m)
