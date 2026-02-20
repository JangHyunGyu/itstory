import re

with open('c:\\workspace\\itstory\\os.html', 'r', encoding='utf-8') as f:
    content = f.read()

print("timeline-group__summary:", len(re.findall(r'<p class="timeline-group__summary">.*?</p>', content, flags=re.DOTALL)))
