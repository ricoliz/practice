# -*- coding: utf-8 -*-
require "nokogiri"
require "fileutils"

class Scraping

  def initialize(src)
    html = File.open(src,"r:UTF-8")
    doc = Nokogiri::HTML(open(src,"r:UTF-8").read)
    dest = "dest/" + src.gsub(%r(\Awww.imj-ip.com/), "")
    string = doc.css("#contents").to_html
    write(dest, string)
  end

   def write(dest, string)
    dir = File.dirname(dest)
    FileUtils.mkdir_p(File.expand_path(dir))
    File.open(dest, "w").write string
    puts "make #{dest} done.."
  end

end

Dir.glob("www.imj-ip.com/**/*.html").each do |e|
  Scraping.new(e)
end
