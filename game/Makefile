MAKE := make
MAKEARGS ?= -j

OOT_VERSION := ntsc-1.0
OOT_REGION 	:= US

MM_VERSION 	:= n64-us

ROMS_DIR        := ../roms

SRC_DIR			:= src
SRC_DIR_OOT		:= $(SRC_DIR)/oot
SRC_DIR_MM 		:= $(SRC_DIR)/mm
SRC_DIR_LOADER 	:= $(SRC_DIR)/loader

BUILD_DIR       := build
STAMPS_DIR      := $(BUILD_DIR)/stamps

MAKEARGS_OOT := COMPILER=gcc COMPARE=0 NON_MATCHING=1 AVOID_UB=1 VERSION=$(OOT_VERSION) REGION=$(OOT_REGION)
MAKEARGS_MM  := COMPILER=gcc COMPARE=0 NON_MATCHING=1 AVOID_UB=1 VERSION=$(MM_VERSION)

.PHONY: all
all: oot mm

.PHONY: setup
setup: setup-oot setup-mm

.PHONY: setup-oot
setup-oot: $(STAMPS_DIR)/setup-oot

.PHONY: codegen
codegen:
	tsx ./codegen.ts

$(STAMPS_DIR)/setup-oot:
	@mkdir -p $(STAMPS_DIR)
	ln -sf $(realpath $(ROMS_DIR)/oot.z64) $(SRC_DIR_OOT)/baseroms/$(OOT_VERSION)/baserom.z64
	$(MAKE) $(MAKEARGS) $(MAKEARGS_OOT) -C $(SRC_DIR_OOT) setup
	touch $@

.PHONY: setup-mm
setup-mm: $(STAMPS_DIR)/setup-mm

$(STAMPS_DIR)/setup-mm:
	@mkdir -p $(STAMPS_DIR)
	ln -sf $(realpath $(ROMS_DIR)/mm.z64) $(SRC_DIR_MM)/baseroms/$(MM_VERSION)/baserom.z64
	$(MAKE) $(MAKEARGS) $(MAKEARGS_MM) -C $(SRC_DIR_MM) venv
	$(MAKE) $(MAKEARGS) $(MAKEARGS_MM) -C $(SRC_DIR_MM) setup
	$(MAKE) $(MAKEARGS) $(MAKEARGS_MM) -C $(SRC_DIR_MM) assets
	$(MAKE) $(MAKEARGS) $(MAKEARGS_MM) -C $(SRC_DIR_MM) disasm
	touch $@

.PHONY: oot
oot: codegen setup loader
	@mkdir -p dist
	$(MAKE) $(MAKEARGS) $(MAKEARGS_OOT) -C $(SRC_DIR_OOT)
	tsx ./spec2fs.ts $(SRC_DIR_OOT)/build/$(OOT_VERSION)/spec $(SRC_DIR_OOT)/build/$(OOT_VERSION)/oot-$(OOT_VERSION).elf dist/oot.json
	cp $(SRC_DIR_OOT)/build/$(OOT_VERSION)/oot-$(OOT_VERSION).z64 dist/oot.z64

.PHONY: mm
mm: codegen setup loader
	@mkdir -p dist
	$(MAKE) $(MAKEARGS) $(MAKEARGS_MM) -C $(SRC_DIR_MM)
	tsx ./spec2fs.ts $(SRC_DIR_MM)/spec/spec $(SRC_DIR_MM)/build/$(MM_VERSION)/mm-$(MM_VERSION).elf dist/mm.json
	cp $(SRC_DIR_MM)/build/$(MM_VERSION)/mm-$(MM_VERSION).z64 dist/mm.z64

.PHONY: loader
loader: codegen setup
	$(MAKE) $(MAKEARGS) -C $(SRC_DIR_LOADER)

.PHONY: clean
clean:
	rm -rf $(SRC_DIR_OOT)/build
	rm -rf $(SRC_DIR_MM)/build
	rm -rf $(SRC_DIR_LOADER)/build

.PHONY: distclean
distclean: clean
	$(MAKE) $(MAKEARGS) -C $(SRC_DIR_OOT) distclean
	$(MAKE) $(MAKEARGS) -C $(SRC_DIR_MM) distclean
	rm -rf $(BUILD_DIR)
