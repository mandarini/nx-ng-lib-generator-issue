If (!( Test-Path $Profile )) { 
New-Item $Profile  -Type  File  -Force
}

$Content = @'
$env:NPM_TOKEN="xxxx"
$env:PROJECT_NPM_TOKEN="xxxxx"
'@ 

$Content | Add-Content $Profile -Encoding  UTF8


# If running in the console, wait for input before closing.
if ($Host.Name -eq "ConsoleHost")
{
    Write-Host "Press any key to continue..."
    $Host.UI.RawUI.FlushInputBuffer()   # Make sure buffered input doesn't "press a key" and skip the ReadKey().
    $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyUp") > $null
}
