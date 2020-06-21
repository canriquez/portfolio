module ApplicationHelper
require 'date'

    def post_age(date)
        current_day = DateTime.now 
        converted = Date::strptime(date, "%d-%m-%Y")
        diff = TimeDifference.between(converted, current_day).in_seconds
        return ChronicDuration.output(diff, :limit_to_months => true, :format => :long, :units => 1)
    end

    def copy_year
        return Time.new.strftime("%Y")
    end
end
