path = r'c:\OTHER\herp-science-platform\apps\bio-intranet\app\[locale]\dashboard\convocatorias\[id]\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Reemplazar todo lo que hay en `<div className="lg:col-span-2 space-y-8">`
# El inicio es justamente `<div className="lg:col-span-2 space-y-8">`
anchor_start = '<div className="lg:col-span-2 space-y-8">'
anchor_end = '{/* Right sidebar details */}'

if anchor_start in content and anchor_end in content:
    parts_start = content.split(anchor_start)
    parts_end = parts_start[1].split(anchor_end)
    
    # parts_end[0] contiene los layouts de descripcion y la antigua ApplicationStatus
    new_block = '''
                        <ApplicationStatus 
                            isParticipant={isParticipant}
                            existingApplication={existingApplication as any}
                            isClosed={isClosed}
                            call={call as any}
                            userProfile={userProfile}
                            locale={locale}
                        />
                    </div>
                    \n\n                    '''
                    
    new_content = parts_start[0] + anchor_start + new_block + anchor_end + parts_end[1]
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Column replace success!")
else:
    print("Column anchor not found!")
