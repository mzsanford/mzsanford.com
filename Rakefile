
require "rubygems"
require "bundler"
Bundler.setup

require 's3_uploader'

def s3_upload(bucket_name, directory)
  S3Uploader.upload_directory(directory, bucket_name, {
    :s3_key    => ENV['MZS_AWS_ACCESS_KEY'],
    :s3_secret => ENV['MZS_AWS_SECRET'],
    :public    => true
  })
end

namespace :build do
  desc "Create static site for blog/ directory"
  task :blog do
    Dir.chdir("blog") do
      sh "jekyll build"
    end
  end

  task :scholarship do
    # Nothing to do here
  end
end

namespace :deploy do
  SITES = %w{ scholarship blog }

  desc "Deploy main site"
  task :root => [ 'build:blog' ] do
    puts "Deploying mzsanford.com ..."
    s3_upload('mzsanford.com', 'blog/_site')
  end

  SITES.each do |site|
    desc "Deploy #{site} site"
    task site.to_sym => [ "build:#{site}" ] do
      puts "Deploying #{site}.mzsanford.com ..."
      s3_upload("#{site}.mzsanford.com", "#{site}/_site")

      # There is a root page with the same names as the sub-domain. Make it the index.
      if File.exists?("#{site}/_site/#{site}.html")
        puts "Setting #{site}.html as root document ..."
        connection = Fog::Storage.new({
          :provider              => 'AWS',
          :aws_access_key_id     => ENV['MZS_AWS_ACCESS_KEY'],
          :aws_secret_access_key => ENV['MZS_AWS_SECRET'],
          :region                => 'us-east-1'
        })
        directory = connection.directories.new(:key => "#{site}.mzsanford.com")
        directory.files.create(
          :key    => 'index.html',
          :body   => File.open("#{site}/_site/#{site}.html"),
          :public => true
        )
      end
    end
  end

  desc "Deploy all sites"
  task :all => [ 'deploy:root' ] + SITES.map{|s| "deploy:#{s}" }

end
