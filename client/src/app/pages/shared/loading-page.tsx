const LoadingPage = () => {
  return (
    <div className="w-full h-[100svh] flex m-auto text-primary">
      <div className="heart-rate self-center">
        <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="150px"
          height="73px"
          viewBox="0 0 150 73"
          enableBackground="new 0 0 150 73"
          xmlSpace="preserve"
        >
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeMiterlimit="10"
            points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
          />
        </svg>
        <div className="fade-in"></div>
        <div className="fade-out"></div>
      </div>
      <style>
        {`
          .heart-rate {
            width: 150px;
            height: 73px;
            position: relative;
            margin: 20px auto;
          }
          
          .fade-in {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: #FFFFFF;
            top: 0;
            right: 0;
            animation: heartRateIn 1.5s linear infinite;
          }
          
          .fade-out {
            position: absolute;
            width: 120%;
            height: 100%;
            top: 0;
            left: -120%;
            animation: heartRateOut 1.5s linear infinite;
            background: rgba(255, 255, 255, 1);
            background: -moz-linear-gradient(left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%);
            background: -webkit-linear-gradient(left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%);
            background: -o-linear-gradient(left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%);
            background: -ms-linear-gradient(left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%);
            background: linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 80%, rgba(255, 255, 255, 0) 100%);
          }
          
          @keyframes heartRateIn {
            0% {
              width: 100%;
            }
            50% {
              width: 0;
            }
            100% {
              width: 0;
            }
          }
          
          @keyframes heartRateOut {
            0% {
              left: -120%;
            }
            30% {
              left: -120%;
            }
            100% {
              left: 0;
            }
          }
          `}
      </style>
    </div>
  );
};
export default LoadingPage;
