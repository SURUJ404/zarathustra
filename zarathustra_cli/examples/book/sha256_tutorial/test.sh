#!/bin/bash
set -e

bin=$1; stdlib=$2

function zarathustra() {
  ZARATHUSTRA_STDLIB=$stdlib $bin "$@"
}

zarathustra compile -i hashexample.zara
zarathustra compute-witness -a 0 0 0 5 --verbose

cp -f hashexample_updated.zara hashexample.zara

zarathustra compile -i hashexample.zara
zarathustra setup
zarathustra export-verifier
zarathustra compute-witness -a 0 0 0 5
zarathustra generate-proof