class WelcomeController < ApplicationController
    def index
    end

    def download_resume
        send_file(
            "#{Rails.root}/public/Carlos_Anriquez_Resume.pdf",
            filename: "CAnriquez_resume.pdf",
            type: "application/pdf"
        )
    end

end
