function Get-Luminance([string]$hex) {
    $hex = $hex.TrimStart('#')
    $r = [Convert]::ToInt32($hex.Substring(0,2), 16) / 255.0
    $g = [Convert]::ToInt32($hex.Substring(2,2), 16) / 255.0
    $b = [Convert]::ToInt32($hex.Substring(4,2), 16) / 255.0
    
    $calc = {
        param($c)
        if ($c -le 0.03928) { return $c / 12.92 }
        else { return [Math]::Pow(($c + 0.055) / 1.055, 2.4) }
    }
    $rL = & $calc $r
    $gL = & $calc $g
    $bL = & $calc $b
    return 0.2126 * $rL + 0.7152 * $gL + 0.0722 * $bL
}

function Get-Contrast([string]$hex1, [string]$hex2) {
    $l1 = Get-Luminance $hex1
    $l2 = Get-Luminance $hex2
    $lighter = [Math]::Max($l1, $l2)
    $darker = [Math]::Min($l1, $l2)
    return ($lighter + 0.05) / ($darker + 0.05)
}

function Blend-Color([string]$fgHex, [double]$alpha, [string]$bgHex) {
    $fgHex = $fgHex.TrimStart('#')
    $bgHex = $bgHex.TrimStart('#')
    $r1 = [Convert]::ToInt32($fgHex.Substring(0,2), 16)
    $g1 = [Convert]::ToInt32($fgHex.Substring(2,2), 16)
    $b1 = [Convert]::ToInt32($fgHex.Substring(4,2), 16)
    $r2 = [Convert]::ToInt32($bgHex.Substring(0,2), 16)
    $g2 = [Convert]::ToInt32($bgHex.Substring(2,2), 16)
    $b2 = [Convert]::ToInt32($bgHex.Substring(4,2), 16)
    $r = [Math]::Round($r1 * $alpha + $r2 * (1.0 - $alpha))
    $g = [Math]::Round($g1 * $alpha + $g2 * (1.0 - $alpha))
    $b = [Math]::Round($b1 * $alpha + $b2 * (1.0 - $alpha))
    return ('{0:X2}{1:X2}{2:X2}' -f [int]$r, [int]$g, [int]$b)
}

Write-Output "--- Madeira shades with White ---"
$mShades = @('#927970', '#836a61', '#765e56', '#69534c', '#5e4942')
foreach ($m in $mShades) {
    $c = Get-Contrast "#FFFFFF" $m
    Write-Output ("White on {0}: {1:N2}" -f $m, $c)
}

Write-Output "--- Contrast of Donut Indicator on --lm-tinta (#1D2430) ---"
# .donut__value is stroke: var(--lm-ceu) (#C1D1E1)
# .donut__track is stroke: rgba(255,255,255,.12)
$dTrack = Blend-Color "#FFFFFF" 0.12 "#1D2430"
$cTrack = Get-Contrast ("#" + $dTrack) "#1D2430"
$cVal = Get-Contrast "#C1D1E1" "#1D2430"
Write-Output ("Donut track [#{0}] on Tinta: {1:N2}" -f $dTrack, $cTrack)
Write-Output ("Donut value (#C1D1E1) on Tinta: {1:N2}" -f $cVal, $cVal)

Write-Output "--- Buttons and Tags in Vitrine ---"
# In vitrine.css: .lm-btn--linha { border-color: var(--lm-borda); color: var(--lm-tinta); }
# In vitrine.css: .lm-chip { background: var(--lm-areia); color: var(--lm-tinta); }
$cChip = Get-Contrast "#1D2430" "#F4F1EC"
Write-Output ("Chip text (#1D2430) on chip bg (#F4F1EC): {0:N2}" -f $cChip)
