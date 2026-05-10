pipeline {
    agent any

    tools {
        nodejs 'Node18'
    }

    environment {
        BASE_URL = 'http://juice-shop-app:3000'
        ADMIN_EMAIL = credentials('juice-admin-email')
        ADMIN_PASSWORD = credentials('juice-admin-password')
        STANDARD_EMAIL = credentials('juice-standard-email')
        STANDARD_PASSWORD = credentials('juice-standard-password')
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                sh 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                echo 'Installing Playwright browsers...'
                sh 'npx playwright install chromium --with-deps'
            }
        }

        stage('Run API Tests') {
            steps {
                echo 'Running API tests...'
                sh 'npm run test:api'
            }
        }

        stage('Run UI Tests') {
            steps {
                echo 'Running UI tests...'
                sh 'npm run test:ui -- --reporter=html'
            }
        }
    }

    post {
        always {
            echo 'Publishing Playwright HTML report...'
            publishHTML(target: [
                allowMissing         : true,        // ← change false to true
                alwaysLinkToLastBuild: true,
                keepAll              : true,
                reportDir            : 'playwright-report',
                reportFiles          : 'index.html',
                reportName           : 'Playwright Test Report'
            ])
        }
        success {
            echo 'All tests passed!'
        }
        failure {
            echo 'Tests failed — check the Playwright report above.'
        }
    }
}