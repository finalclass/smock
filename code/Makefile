# @axiom: infrastructure.md#system-budowania
.PHONY: build check test clean lock dev

build:
	dune build --display=verbose

check:
	dune build @check

test:
	dune test

clean:
	dune clean

lock:
	dune pkg lock

dev:
	set -a && . ./.env && set +a && dune exec -w bin/main.exe
# /@axiom: infrastructure.md#system-budowania
