# -*- coding: utf-8 -*-

# カレントディレクトリ以下のファイルリストを作ってください。
# フファイル名はlist.txt

# puts File.open("list.txt","r").read
# p File.open("list.txt", "r").readlines
# 書き込む
# File.open("list.txt","w").write("write mode")
# list = Dir.glob("**/*.html")
# list.each do |e|
# 	p e
# end

list = Dir.glob("**/*.html")

File.open("list.txt","w") do |writer|
	# list.gsub!(/,/, ",\n")
	# list.puts writer
	writer << list

end

# open('./new_file.txt', 'a+') do |new_file|
# 	file_text = open('./file.txt').read
# 	# ,は句点
# 	file_text.gsub!(/,/, ",\n")
# 	# 日本語の句点ならこっち
# 	# file_text.gsub(/、/, "、\n")
# 	new_file.puts file_text
# end

# File.open("list.txt","w") do |writer|
# 	list.each{|d|
# 		# puts d
# 		writer << d
# 	}
# end



# File.open("./list.txt","w") do |writer|
# 	system.each do |e|
# 		writer << list
# 	end
# end