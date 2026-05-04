@echo off
cd /d "%~dp0"
"C:\Users\meism\AppData\Local\Programs\MiKTeX\miktex\bin\x64\pdflatex.exe" -interaction=nonstopmode report.tex
"C:\Users\meism\AppData\Local\Programs\MiKTeX\miktex\bin\x64\pdflatex.exe" -interaction=nonstopmode report.tex
echo Compilation complete. PDF generated.
pause