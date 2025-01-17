<!--
ZoneDropFile.vue - File Drop Zone Component

This component defines a drop zone for uploading files. It allows users to drag and drop files or select them using a button.

Author: ChacalTordu
-->

<template>
  <div 
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
    @dragover.prevent
    @drop.prevent="handleDrop"
    :class="{'activeDropzone': active , 'hasFile': hasFile}"
    class="dropzone">
    <span v-if="!hasFile">Drag or Drop File</span>
    <span v-if="!hasFile">OR</span>
    <ButtonSelectFile v-if="!hasFile" fileFormat=".torrent" @fileSelected="handleFileSelected"/>
    <span v-if="hasFile">{{ fileName }}</span>
    <ButtonAbort v-if="hasFile" textButton="Annuler" @abort="handleAbort"/>
  </div>
</template>

<script setup>
import ButtonSelectFile from './button/ButtonSelectFile.vue';
import ButtonAbort from './button/ButtonAbort.vue';
import { ref } from 'vue';

const acceptedFormat = ".torrent";

const active = ref(false);
const hasFile = ref(false);
const fileName = ref('');

const emits = defineEmits(['resetButton','fileChosen','abordClicked']);

/**
 * Handles drag enter event
 */
const handleDragEnter = (event) => {
  event.preventDefault();
  active.value = true;
};

/**
 * Handles drag leave event
 */
const handleDragLeave = () => {
  active.value = false;
};

/**
 * Handles file drop event
 */
const handleDrop = (event) => {
  event.preventDefault();
  active.value = false;
  const files = event.dataTransfer.files;
  if (files.length !== 1) {
    alert("Veuillez ne déposer qu'un seul fichier.");
  } else if (!checkFileFormat(files[0])) {
    alert(`Veuillez sélectionner un fichier ${acceptedFormat}.`);
  } else {
    handleFileSelected(files[0]);
  }
};

/**
 * Handles file selected event
 */
const handleFileSelected = (file) => {
  if (checkFileFormat(file)) {
    alert(`Veuillez sélectionner un fichier ${acceptedFormat}.`);
  } else {
    hasFile.value = true;
    fileName.value = file.name;
    emits('fileChosen', file);
  }
};

/**
 * Checks file format
 */
const checkFileFormat = (file) => {
  const fileExtension = file.name.split('.').pop();
  return fileExtension.toLowerCase() === acceptedFormat.toLowerCase();
};

/**
 * Handles abort event
 */
const handleAbort = () => {
  try {
    hasFile.value = false;
    fileName.value = '';
    emits('abordClicked');
    console.log("Fichier annulé avec succès");
  } catch (error) {
    console.error("Une erreur est survenue:", error);
  }
};
</script>

<style scoped>
/**
 * Dropzone Styles
 */
.dropzone {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 200px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-size: 16px;
  color: #666;
  padding: 10px;
  transition: background-color 0.3s ease-in-out;
}

.dropzone span {
  margin-bottom: 10px;
}

/**
 * Active Dropzone Styles
 */
.activeDropzone {
  background-color: #f0f0f0;
}

/**
 * File Present Styles
 */
.hasFile {
  border-style: solid;
}

/**
 * Blinking Effect Styles
 */
.blink {
  outline: 2px solid var(--red-color-4); 
  border: none;
}
</style>
