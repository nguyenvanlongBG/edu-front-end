<template>
  <div class="side-bar">
    <div class="logo">
      <span class="edu">Edu</span>
      <span class="social">Social</span>
    </div>
    <div v-if="pageFocus == Menu.FORUM">
      <div class="main-menu-block">
        <ul class="main-menu">
          <li class="item-menu" @click="navigateToPage('post')">
            <div class="block-img-menu-item">
              <img src="../../assets/pictures/forum.png" alt="" />
            </div>
            <span class="title-menu-item">Diễn đàn</span>
          </li>
          <li class="item-menu" @click="navigateToPage('test-library')">
            <div class="block-img-menu-item">
              <img src="../../assets/pictures/library.png" alt="" />
            </div>
            <span class="title-menu-item">Thư viện</span>
          </li>
          <li class="item-menu" @click="navigateToPage('test-library')">
            <div class="block-img-menu-item">
              <img src="../../assets/pictures/exam.png" alt="" />
            </div>
            <span class="title-menu-item">Kỳ thi</span>
          </li>
          <li class="item-menu" @click="navigateToPage('classroom')">
            <div class="block-img-menu-item">
              <img src="../../assets/pictures/classroom.png" alt="" />
            </div>
            <span class="title-menu-item">Lớp học</span>
          </li>
          <li class="item-menu" @click="navigateToPage('report-test')">
            <div class="block-img-menu-item">
              <img src="../../assets/pictures/analysis.png" alt="" />
            </div>
            <span class="title-menu-item">Báo cáo</span>
          </li>
        </ul>
      </div>
      <div class="line"></div>
    </div>
    <GroupMenu v-if="pageFocus == Menu.GROUP"> </GroupMenu>
  </div>
</template>
<script src="./left-menu.ts" lang="ts"></script>
<style src="./left-menu.scss" lang="scss"></style>
