SRC_PATH = src
LIB_PATH = lib
EXT_DIR = ext
TEST_DIR = test

HL_SRC = $(SRC_PATH)/jquery.textHighlighter.js
RANGY_SRC = $(LIB_PATH)/rangy-core.js

HL_MIN = $(HL_SRC:.js=.min.js)
HL_PACK_MIN = $(HL_SRC:.js=.pack.min.js)

CLOSURE_COMPILER = compiler.jar
CC_PATH = $(EXT_DIR)/$(CLOSURE_COMPILER)

TARGETS = $(HL_MIN) $(HL_PACK_MIN)

BROWSER = firefox
JSHINT_CONFIG = jshint-config.json
JSHINT_BIN = jshint

all: $(TARGETS)

$(HL_MIN): $(HL_SRC)
	java -jar $(CC_PATH) \
	--js $^ \
	--js_output_file $@

$(HL_PACK_MIN): $(HL_SRC) $(RANGY_SRC)
	java -jar $(CC_PATH) \
	--js $^ \
	--js_output_file $@

clean:
	rm $(TARGETS)

coverage:
	@./coverage.sh

jshint: jshint_presence
	@echo "Running JSHint...\n"
	@${JSHINT_BIN} ${HL_SRC} --config ${JSHINT_CONFIG}
	@echo "Congratulation!"

jshint_presence:
	@type ${JSHINT_BIN} >/dev/null 2>&1 \
	|| { echo >&2 "I require ${JSHINT_BIN} but it's not installed. Aborting."; exit 1; }

test:
	${BROWSER} ${TEST_DIR}/*.html

.PHONY: test all clean coverage js_hint js_hint_presence