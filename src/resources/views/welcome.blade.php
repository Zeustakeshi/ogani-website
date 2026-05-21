<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Laravel</title>
    @viteReactRefresh                          {{-- ← thêm dòng này --}}
    @vite(['resources/js/main.tsx'])            {{-- ← thêm dòng này --}}
</head>
<body>
    <div id="root"></div>                      {{-- ← React mount vào đây --}}
</body>
</html>