NAME=cv

all:
	latexmk -pdflua -lualatex="lualatex --shell-escape %O %S" -interaction=nonstopmode -output-directory=. ${NAME}.tex

clean:
	rm -f ${NAME}.aux ${NAME}.bbl ${NAME}.bcf ${NAME}.fdb_latexmk ${NAME}.fls ${NAME}.log ${NAME}.out ${NAME}.run.xml ${NAME}.blg ${NAME}.toc *\~

distclean: clean
	rm -f ${NAME}.pdf
