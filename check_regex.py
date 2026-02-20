import re

with open('c:\\workspace\\itstory\\os.html', 'r', encoding='utf-8') as f:
    content = f.read()

print("timeline-group__summary:", len(re.findall(r'<p class="timeline-group__summary">.*?</p>', content, flags=re.DOTALL)))
print("event-detail__summary:", len(re.findall(r'<p class="event-detail__summary">.*?</p>', content, flags=re.DOTALL)))
print("event-detail__story:", len(re.findall(r'<div class="event-detail__story">.*?</div>', content, flags=re.DOTALL)))
print("event-detail__notes:", len(re.findall(r'<div class="event-detail__notes">.*?</div>', content, flags=re.DOTALL)))
