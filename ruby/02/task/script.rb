# -*- coding: utf-8 -*-

# カレントディレクトリ以下のファイルリストを作ってください。
# フファイル名はlist.txt

ary = Dir.glob("**/*.html")

File.open("list.txt","w") do |w|
	ary.each do |lists|
		w << lists
		w << "\n"
	end
	puts w
end


# Dir.glob("**/*.html") do |w|
# 	w.each do |s|
# 		puts s
# 	end
# end

# Dir.glob("**/*.html").each do |w|
# 	File.open("list.txt","w"){|f| f.write w}
# end


	# list.each do |e|
	# p e
	# list.each do |write|
	# 	p write
	# end

# File.open("list.txt","w") do |writer|
# 	# list.gsub!(/,/, ",\n")

# 	writer << list
# 	# puts list
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