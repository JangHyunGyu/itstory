from pathlib import Path
t = Path('roadmap.html').read_text(encoding='utf-8')
# find all week-cell occurrences in markup
idx = 0
n = 0
while True:
    i = t.find('week-cell', idx)
    if i < 0 or n > 25:
        break
    print('\n---', n, 'at', i, '---')
    print(t[max(0,i-80):i+180].replace('\n', ' | '))
    idx = i + 1
    n += 1
