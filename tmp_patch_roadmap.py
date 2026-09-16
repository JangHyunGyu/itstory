from pathlib import Path
path = Path('roadmap.html')
text = path.read_text(encoding='utf-8')
old = '''                  <ol class="parts"><li>Flexbox</li><li>Grid</li><li>Position과 Stacking Context</li><li>Overflow와 스크롤 컨테이너</li><li>반응형 레이아웃</li></ol>'''
new = '''                  <ol class="parts"><li><span class="part-topic">Flexbox</span><span class="part-owner">김유진</span></li><li><span class="part-topic">Grid</span></li><li><span class="part-topic">Position과 Stacking Context</span><span class="part-owner">김수민</span></li><li><span class="part-topic">Overflow와 스크롤 컨테이너</span></li><li><span class="part-topic">반응형 레이아웃</span></li></ol>'''
if old not in text:
    raise SystemExit('week 07 parts block not found exactly')
text = text.replace(old, new, 1)
path.write_text(text, encoding='utf-8')
print('updated')
# verify
assert 'part-owner">김유진' in path.read_text(encoding='utf-8')
assert 'part-owner">김수민' in path.read_text(encoding='utf-8')
print('owners ok')
