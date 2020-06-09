class ContactController < ApplicationController


    def create
        p contact_params
        @contact = Contact.new(contact_params)
        if @contact.save #if we succeed to store the contact
            puts 'We created successfully '
            p @contact
            ContactMailer.with(contact: @contact).contact_email.deliver_later
        else 
            puts 'failed to create contact'
        end
        head :ok

    end

    private
    def contact_params
        puts 'Enrolled a new contact, here are the params :'
        p params
        params.permit(:name, :email, :message, :subject, "g-recaptcha-response")
      end
end
