import re

with open('c:/workspace/itstory/databases.html', 'r', encoding='utf-8') as f:
    content = f.read()

tags = ['timeline-group__summary', 'event-detail__summary', 'event-detail__story', 'event-detail__notes']
with open('c:/workspace/itstory/extract.txt', 'w', encoding='utf-8') as out:
    for tag in tags:
        matches = re.findall(r'<[^>]+class=[\"\']' + tag + r'[\"\'][^>]*>(.*?)</(?:p|div)>', content, re.DOTALL)
        out.write(f'--- {tag} ---\n')
        for m in matches:
            out.write(m.strip() + '\n\n')
