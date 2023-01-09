pipeline {
    agent {
        label "slave1"
    }
    parameters {
        string(name: 'tag', defaultValue: "${env.BUILD_NUMBER}", description: "Here we define the version or tag for our new image")
    }
    stages {
        stage('SCM') {
            steps {
                echo "PULL CODE FROM GITHUB"
                cleanWs()
                git branch: 'feature/sheersh', url: 'https://github.com/sheershjain/expense-sharing.git'
            }
        }
        stage('Created Artifact & Build Image') {
            steps {
                slackSend message: "Build Started ${tag}"
                sh '''
				docker build -t sheersh/divyanshi:${tag} .
                docker rmi $(docker images -f "dangling=true" -q)
				'''
                slackSend message: "Build Completed, Image name -> sheersh/divyanshi:${tag}"
				mail bcc: '', body: "Build is completed. Image name -> sheersh/divyanshi:${tag}", cc: 'harshit@gkmit.co', from: '', replyTo: '', subject: 'Build successful', to: 'divyanshi@gkmit.co'
                sh 'curl -s -X POST https://api.telegram.org/bot5957608414:AAFRgQCY6rjbOUdsfiNgtQ03-euDDgBevQk/sendMessage -d chat_id=-1001461072821 -d parse_mode="HTML" -d text="Build Successfull. Image name -> sheersh/divyanshi:${tag}"'
            }
        }
        stage('Push image to dockerhub') {
            steps {
                withCredentials([string(credentialsId: 'f6dbd8af-8a0f-40ee-932d-181fd4e16047', variable: 'DOCKER_HUB_PASS')]) {
                    sh "docker login -u sheersh -p $DOCKER_HUB_PASS"
                }
                slackSend message: "Pushed image -> sheersh/divyanshi:${tag} to Docker Hub"
				sh "docker push sheersh/divyanshi:${tag}"
                sh "docker rmi -f sheersh/divyanshi:${tag}"
                mail bcc: '', body: 'New Build image is pushed to Docker HUb', cc: 'harshit@gkmit.co', from: '', replyTo: '', subject: 'Image pushed successful', to: 'divyanshi@gkmit.co'
                sh 'curl -s -X POST https://api.telegram.org/bot5957608414:AAFRgQCY6rjbOUdsfiNgtQ03-euDDgBevQk/sendMessage -d chat_id=-1001461072821 -d parse_mode="HTML" -d text="Image pushed to Docker HUB"'
            }
        }
        stage('Deploy webapp in DEV environment') {
            steps {
                sh "docker pull sheersh/divyanshi:${tag}"
                sh "docker tag sheersh/divyanshi:${tag} divyanshi:latest"
                sh "docker-compose -f /home/ec2-user/docker-compose.yml restart -d"
                
                slackSend message: "Backend deployed in Dev Environment Successfully at http://13.233.21.134/ with image sheersh/divyanshi:${tag} "
                mail bcc: '', body: "Backend deployed in Dev Environment Successfully at http://13.233.21.134/ with image sheersh/divyanshi:${tag}", cc: 'harshit@gkmit.co', from: '', replyTo: '', subject: 'Deploy in DEV', to: 'divyanshi@gkmit.co'
                sh 'curl -s -X POST https://api.telegram.org/bot5957608414:AAFRgQCY6rjbOUdsfiNgtQ03-euDDgBevQk/sendMessage -d chat_id=-1001461072821 -d parse_mode="HTML" -d text="Backend deployed in Dev Environment Successfully at http://13.233.21.134/ with image sheersh/divyanshi:${tag}"'
				sh "docker rmi -f sheersh/divyanshi:${tag}"
            }
        }   
    }
    post{
		success{
			slackSend message: "Pipeline run successfull"
		}
		failure{
			sendMessage message:"Kuch tho fta hai"
		}
	}
}




