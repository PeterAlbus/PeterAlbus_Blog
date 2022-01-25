module.exports = {
    devServer: {
        port: 80, //修改服务端口号

        public: require('os').networkInterfaces()[Object.keys(require('os').networkInterfaces())[0]][1].address + ':80',
    },
}
