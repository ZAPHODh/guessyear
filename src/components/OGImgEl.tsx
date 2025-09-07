export const RenderIMGEl = ({
    siteName,
    locale,
    isDailyPage,
}: {
    siteName: string;
    locale: string;
    isDailyPage: boolean;
}) => {
    return (
        <div
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'system-ui',
                color: 'white',
                position: 'relative',
            }}
        >
            <div
                style={{
                    fontSize: '72px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: '40px',
                }}
            >
                {siteName}
            </div>

            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>
                    {isDailyPage ? 'Daily' : 'Game'}
                </div>
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>
                    {isDailyPage ? 'Daily Photo Challenge' : 'Guess the Year'}
                </div>
                <div style={{ fontSize: '24px', opacity: 0.8 }}>
                    {isDailyPage 
                        ? 'Guess the year this photo was taken!' 
                        : 'Challenge your visual skills with vintage photos'
                    }
                </div>
            </div>

            <div
                style={{
                    position: 'absolute',
                    bottom: '40px',
                    right: '40px',
                    fontSize: '18px',
                    opacity: 0.7,
                }}
            >
                /{locale}
            </div>
        </div>
    );
};