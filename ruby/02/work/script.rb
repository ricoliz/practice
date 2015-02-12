# -*- coding: utf-8 -*-
# http://qiita.com/tk-ota@github/private/933778b3be6c23d98c6d

list = Dir.glob("**/*.html")

# Write Read
puts File.open("read.txt", "r").read
# p File.open("read.txt", "r").readlines

# Write File
File.open("write.txt", "w").write("Write mode")
