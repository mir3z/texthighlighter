SRC_PATH=src
LIB_PATH=lib

HL_SRC=$(SRC_PATH)/jquery.textHighlighter.js
RANGY_SRC=$(LIB_PATH)/rangy-core.js

HL_MIN=$(SRC_PATH)/jquery.textHighlighter.min.js
HL_PACK_MIN=$(SRC_PATH)/jquery.textHighlighter.pack.min.js

all: min min-pack

min: $(HL_MIN)
min-pack: $(HL_PACK_MIN)

$(HL_MIN): $(HL_SRC)
	java -jar $$GOOGLE_COMPILER_PATH/compiler.jar \
	--js $(HL_SRC) \
	--js_output_file $(HL_MIN)

$(HL_PACK_MIN): $(HL_SRC) $(RANGY_SRC)
	java -jar $$GOOGLE_COMPILER_PATH/compiler.jar \
	--js $(HL_SRC) \
	--js $(RANGY_SRC) \
	--js_output_file $(HL_PACK_MIN)

clean:
	rm $(HL_MIN) $(HL_PACK_MIN)