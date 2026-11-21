import io, re, subprocess, sys, os
p = sys.argv[1]
import tempfile; d = tempfile.mkdtemp(prefix='chk')
s = io.open(p, encoding='utf-8').read()
ok = True
for k, m in enumerate(re.finditer(r'<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)</script>', s)):
    code = m.group(1)
    start_line = s[:m.start(1)].count('\n')
    f = os.path.join(d, 'b%d.js' % k)
    io.open(f, 'w', encoding='utf-8').write('\n' * start_line + code)
    r = subprocess.run(['node', '--check', f], capture_output=True, text=True, encoding='utf-8')
    if r.returncode:
        ok = False
        print('BLOCO', k, r.stderr[:1200])
print('SINTAXE OK' if ok else 'ERRO DE SINTAXE')
