
Dir['*.markdown'].each do |file|
  next if file =~ /^\d+-\d+-\d+/
  contents = File.read(file)

  puts "#{file}: #{contents.length}"
  name = File.basename(file, '.markdown')
  parts = contents.split(/\n\n/)
  header = parts.shift

  header.sub!(/^Author: .*$/, '')
  header.sub!(/\n\n*/m, "\n")
  header.gsub!(/^([^:]+): (.*)$/) {|m| "#{$1.downcase}: #{$2}" }
  header << "\npermalink: blog/#{name}/index.html"
  header << "\nlayout: post"

  md = header.match(/date: (\d+-\d+-\d+)/)
  date = md[1]

  parts = parts.map do |part|
    part.gsub(/\!\[([^\]]+)\]\(([^\)]+)\)/, '![\1]({{ site.url }}/assets/\2)')
  end

  File.open("#{date}-#{file}", 'w') do |f|
    f.puts "---"
    f.puts header
    f.puts "---"
    f.puts ""
    f.puts parts.join("\n\n")
  end
end
