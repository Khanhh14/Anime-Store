<!-- src/views/HomeView.vue -->
<template>
  <div class="min-h-screen bg-white text-gray-900">
    <!-- Header Component -->
    <Header 
      @logo-click="handleLogoClick"
      @nav-click="handleNavClick"
      @search-click="handleSearchClick"
      @login="handleLogin"
      @signup="handleSignup"
      @logout="handleLogout"
      @view-profile="handleViewProfile"
    />

    <!-- Main Content -->
    <main class="min-h-screen">
      <div class="px-2 sm:px-4 md:px-6 lg:px-8 py-4">
        <HeroSection :bg="heroBg" />
      </div>

      <SeriesStrip />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Header from '@/components/Home/Header.vue'
import HeroSection from '@/components/Home/HeroSection.vue'
import SeriesStrip  from '@/components/Home/SeriesStrip.vue'

const router = useRouter()
const heroBg = '/images/hero.jpg'

// Handle Header Events
const handleLogoClick = () => {
  console.log('Logo clicked')
  // Navigate to home or refresh
}

const handleNavClick = (linkId) => {
  console.log('Navigation clicked:', linkId)
  // Handle navigation based on linkId
  if (linkId === 'home') {
    router.push({ name: 'home' })
  } else if (linkId === 'collections') {
    router.push({ name: 'collections' })
  } else if (linkId === 'series') {
    // Handle series/anime navigation
    console.log('Navigate to series')
  } else if (linkId === 'about') {
    router.push({ name: 'about' })
  } else if (linkId === 'contact') {
    // Handle contact navigation
    console.log('Navigate to contact')
  }
}

const handleSearchClick = () => {
  console.log('Search clicked')
  // Open search modal or navigate to search page
}

const handleLogin = () => {
  console.log('Login clicked')
  // Navigate to login page
  router.push({ name: 'login' })
}

const handleSignup = () => {
  console.log('Sign up clicked')
  // Navigate to signup page
  router.push({ name: 'register' })
}

const handleLogout = () => {
  console.log('User logged out')
  // User is already logged out by Header component
  // Refresh page to update state
  window.location.reload()
}

const handleViewProfile = () => {
  console.log('View profile clicked')
  // Navigate to dashboard
  router.push({ name: 'dashboard' })
}
</script>
