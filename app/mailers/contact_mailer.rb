class ContactMailer < ApplicationMailer


    def contact_email
        @contact = params[:contact]
        @url  = 'https://www.carlosanriquez.com'
        mail(to: 'canriquez@gmail.com', subject: 'Contact from Portfolio Page!')
      end
end
