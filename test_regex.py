import re

with open('c:\\workspace\\itstory\\was.html', 'r', encoding='utf-8') as f:
    content = f.read()

key = "1990-cern-httpd"
pattern = r'(<template id="event-' + key + r'">.*?<section class="event-detail__body">\s*)<div class="event-detail__story">.*?</div>\s*<div class="event-detail__notes">.*?</div>(\s*</section>)'

match = re.search(pattern, content, flags=re.DOTALL)
if match:
    print("Matched!")
else:
    print("Not matched!")
